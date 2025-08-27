import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth.config";
import { prisma } from "@/lib/prisma";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

export async function POST(_req: NextRequest, ctx: any) {
  const { id } = await (ctx as any).params;
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Fetch roadmap owned by the user
  const roadmap = await (prisma as any).roadmap.findFirst({ where: { id, userId: session.user.id } });
  if (!roadmap) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const content = (roadmap as any).content || {};
  const milestones: any[] = Array.isArray(content?.milestones) ? content.milestones : [];
  if (milestones.length === 0) return NextResponse.json({ error: "No milestones" }, { status: 400 });

  // If already prepared in new format, return
  if (Array.isArray((content as any).materialsByMilestone)) {
    return NextResponse.json({ ok: true, alreadyPrepared: true });
  }

  const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash-latest",
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.6,
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ],
  });

  const prompt = new PromptTemplate({
    template: `Anda adalah mentor. Tulis materi belajar yang jelas dan ramah pemula untuk satu milestone.

Milestone: {topic}
Subbab:
{subbab}

Instruksi:
- Jelaskan konsep inti secara runtut dan praktis, gunakan bahasa Indonesia yang natural.
- Sertakan 2-3 paragraf narasi. Tambahkan 1-2 poin materi (bullet) yang menekankan inti konsep.
- Jangan menambahkan tugas/ujian/latihan/projek.
- Kembalikan hanya teks panjang untuk "body" dan bullet dalam format: Body:\n<paragraf>\n\nPoin:\n- <poin a>\n- <poin b>
`,
    inputVariables: ["topic", "subbab"],
  });

  const materialsByMilestone: any[][] = [];
  for (let i = 0; i < milestones.length; i++) {
    const m = milestones[i];
    const list: string[] = Array.isArray(m.subbab) ? m.subbab : Array.isArray(m.sub_tasks) ? (m.sub_tasks as any[]).map((t) => (typeof t === 'string' ? t : t?.task)).filter(Boolean) : [];
    const items: any[] = [];
    for (let j = 0; j < list.length; j++) {
      const sub = list[j];
      const details = `- ${sub}`;
      const p = await prompt.format({ topic: `${m.topic} — ${sub}`, subbab: details });
      const res = await model.invoke([{ role: 'user', content: p }] as any);
      const text = (res as any)?.content?.[0]?.text || (res as any)?.content || '';
      const hero = `https://source.unsplash.com/1200x500/?${encodeURIComponent(sub)}`;
      items.push({ milestoneIndex: i, subIndex: j, title: sub, body: String(text || '').trim(), points: [], heroImage: hero });
    }
    materialsByMilestone.push(items);
  }

  // Save back into content.materials
  const newContent = { ...(content || {}), materialsByMilestone };
  await (prisma as any).roadmap.update({ where: { id: roadmap.id }, data: { content: newContent } });

  return NextResponse.json({ ok: true, count: materialsByMilestone.reduce((a, b) => a + b.length, 0) });
}
