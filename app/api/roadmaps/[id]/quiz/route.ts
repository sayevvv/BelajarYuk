import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth.config';
import { prisma } from '@/lib/prisma';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';

export async function GET(req: NextRequest, ctx: any) {
  const { id } = await (ctx as any).params;
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const url = new URL(req.url);
  const m = Number(url.searchParams.get('m') || '0');

  const roadmap = await (prisma as any).roadmap.findFirst({ where: { id, userId: session.user.id } });
  if (!roadmap) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const content: any = (roadmap as any).content || {};
  const byMilestone: any[][] = Array.isArray(content.materialsByMilestone) ? content.materialsByMilestone : [];
  const materials = byMilestone[m] || [];
  if (!materials.length) {
    return NextResponse.json({ questions: [] });
  }

  // Build context strictly from generated materials of this milestone's subbab
  const contextParts: string[] = materials.map((it, idx) => {
    const pts = Array.isArray(it.points) && it.points.length ? `\nPoin:\n- ${it.points.join('\n- ')}` : '';
    return `Subbab ${idx + 1}: ${it.title}\nBody:\n${(it.body || '').toString().slice(0, 2000)}${pts}`; // limit body per subbab to keep prompt size reasonable
  });
  const context = contextParts.join('\n\n---\n\n');

  const model = new ChatGoogleGenerativeAI({ model: 'gemini-1.5-flash-latest', apiKey: process.env.GOOGLE_API_KEY, temperature: 0.4 });
  const prompt = new PromptTemplate({
    template: `Anda membuat 5 soal pilihan ganda BERDASARKAN KONTEN DI BAWAH INI SAJA. Jangan gunakan pengetahuan luar konteks.
Kembalikan HANYA JSON valid dalam format:
[
  {{"q":"...","choices":["A","B","C","D"],"answer":0}}
]
Persyaratan:
- Soal tingkat pemula-menengah.
- Pastikan jawaban benar dapat diverifikasi dari konteks.
- Jangan sertakan penjelasan atau teks lain di luar JSON.

Konteks Materi:
{context}
`,
    inputVariables: ['context']
  });
  const p = await prompt.format({ context });
  try {
    const res = await model.invoke([{ role: 'user', content: p }] as any);
    let raw: string = (res as any)?.content?.[0]?.text || (res as any)?.content || '';
    let text = String(raw).trim();
    // strip markdown fences if present
    if (text.startsWith('```')) {
      const first = text.indexOf('\n');
      const last = text.lastIndexOf('```');
      if (first !== -1 && last !== -1) text = text.slice(first + 1, last).trim();
    }
    // extract first JSON array substring
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start !== -1 && end !== -1 && end > start) {
      text = text.slice(start, end + 1);
    }
    const parsed = JSON.parse(text);
    const items = Array.isArray(parsed) ? parsed : [];
    const cleaned = items
      .filter((it: any) => it && typeof it.q === 'string' && Array.isArray(it.choices) && typeof it.answer !== 'undefined')
      .map((it: any) => ({
        q: String(it.q),
        choices: it.choices.map((c: any) => String(c)).slice(0, 6),
        answer: Math.max(0, Math.min((it.choices?.length || 1) - 1, Number(it.answer)))
      }));
    if (cleaned.length) return NextResponse.json({ questions: cleaned.slice(0, 5) });
  } catch {}
  return NextResponse.json({ questions: [] });
}

export async function POST(req: NextRequest, ctx: any) {
  const { id } = await (ctx as any).params;
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { milestoneIndex, score, passed } = body as { milestoneIndex: number; score: number; passed: boolean };

  const roadmap = await (prisma as any).roadmap.findFirst({ where: { id, userId: session.user.id }, include: { progress: true } });
  if (!roadmap) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const key = `quiz-m-${milestoneIndex}`;
  const map = (roadmap as any).progress?.completedTasks || {};
  map[key] = { passed: !!passed, score: Number(score) };

  const updated = await (prisma as any).roadmapProgress.upsert({
    where: { roadmapId: id },
    create: { roadmapId: id, completedTasks: map, percent: (roadmap as any).progress?.percent || 0 },
    update: { completedTasks: map },
  });
  return NextResponse.json(updated);
}
