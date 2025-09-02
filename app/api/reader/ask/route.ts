import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth.config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { assertSameOrigin, sanitizeString } from '@/lib/security';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  // CSRF and auth
  try { assertSameOrigin(req as any); } catch (e: any) { return NextResponse.json({ error: 'Forbidden' }, { status: e?.status || 403 }); }
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
  const body = await req.json();
  const { question, context, history, roadmapId: ridTop, m: mTop, s: sTop } = body || ({} as any);
    const q = sanitizeString(String(question || ''), { maxLen: 500 });
    if (!q) return NextResponse.json({ error: 'Question required' }, { status: 400 });
    // If client context is missing or empty, try to fetch from DB using identifiers
  let c = context as any;
    const hasClientCtx = !!(c && (c.title || c.body || (Array.isArray(c.points) && c.points.length)));
  const idCandidate = (c?.roadmapId as string) || (ridTop as string);
  const mCandidate = Number.isInteger(c?.m) ? Number(c?.m) : Number.isInteger(mTop) ? Number(mTop) : undefined;
  const sCandidate = Number.isInteger(c?.s) ? Number(c?.s) : Number.isInteger(sTop) ? Number(sTop) : undefined;
  if (!hasClientCtx && idCandidate != null && mCandidate != null && sCandidate != null) {
      try {
    const roadmap = await prisma.roadmap.findFirst({ where: { id: String(idCandidate), userId: session.user.id } });
        const content: any = (roadmap as any)?.content || {};
        const byMilestone: any[][] = Array.isArray(content?.materialsByMilestone) ? content.materialsByMilestone : [];
    const m = Math.min(Math.max(0, Number(mCandidate)), Math.max(0, byMilestone.length - 1));
    const s = Math.min(Math.max(0, Number(sCandidate)), Math.max(0, ((byMilestone?.[m] as any[])?.length || 1) - 1));
        const cur = byMilestone?.[m]?.[s];
        if (cur) {
          c = {
            title: String(cur?.title || ''),
            body: String(cur?.body || ''),
            points: Array.isArray(cur?.points) ? cur.points : [],
          };
        }
      } catch {}
    }

    const title = sanitizeString(String(c?.title || ''), { maxLen: 200 });
    const bodyText = String(c?.body || '').slice(0, 4000);
    const points: string[] = Array.isArray(c?.points) ? c.points.map((p: any) => sanitizeString(String(p), { maxLen: 200 })) : [];
    const ctx = [`Judul: ${title}`, `Isi:\n${bodyText}`, points.length ? `Poin:\n- ${points.join('\n- ')}` : ''].filter(Boolean).join('\n\n');
    const past = Array.isArray(history) ? history.slice(-6).map((m: any) => ({ role: m?.role === 'user' ? 'user' : 'assistant', content: sanitizeString(String(m?.content || ''), { maxLen: 600 }) })) : [];

    const tmpl = new PromptTemplate({
      template: `Anda adalah asisten belajar. Jawab pertanyaan HANYA berdasarkan konteks materi di bawah ini. Jika jawabannya tidak ada di konteks, katakan dengan jujur bahwa Anda tidak menemukan jawabannya pada materi ini dan beri saran bagian mana yang perlu dibaca ulang. Gunakan bahasa Indonesia yang jelas dan ringkas.

KONTEKS MATERI:
{context}

Riwayat Singkat Percakapan (opsional):
{history}

Pertanyaan: {question}

Jawaban yang fokus pada konteks (maksimal 8 kalimat):`,
      inputVariables: ['context', 'history', 'question']
    });

    const model = new ChatGoogleGenerativeAI({ model: 'gemini-1.5-flash-latest', apiKey: process.env.GOOGLE_API_KEY, temperature: 0.4 });
    const prompt = await tmpl.format({
      context: ctx,
      history: past.map((m) => `${m.role === 'user' ? 'User' : 'Asisten'}: ${m.content}`).join('\n').slice(0, 2000),
      question: q,
    });
    const res = await model.invoke([{ role: 'user', content: prompt }] as any);
    const text = String((res as any)?.content?.[0]?.text || (res as any)?.content || '').trim().slice(0, 1200);
    return NextResponse.json({ answer: text });
  } catch (e) {
    console.error('reader/ask error', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
