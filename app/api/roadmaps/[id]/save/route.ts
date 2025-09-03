import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth.config';
import { prisma } from '@/lib/prisma';
import { assertSameOrigin } from '@/lib/security';

export async function POST(req: NextRequest, ctx: any) {
  try { assertSameOrigin(req as any); } catch (e: any) { return NextResponse.json({ error: 'Forbidden' }, { status: e?.status || 403 }); }
  const { id } = await (ctx as any).params;
  const session = await getServerSession(authOptions as any);
  if (!(session as any)?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session as any).user.id as string;

  // Ensure the roadmap is public and not owned by the same user
  const src = await (prisma as any).roadmap.findUnique({ where: { id }, select: { id: true, published: true, userId: true } });
  if (!src || !src.published) return NextResponse.json({ error: 'Roadmap tidak lagi publik dan tidak dapat disimpan.' }, { status: 403 });
  if ((src as any).userId === userId) return NextResponse.json({ error: 'Tidak bisa menyimpan roadmap milik sendiri' }, { status: 400 });

  await prisma.$transaction(async (tx) => {
    const t: any = tx as any;
    await t.roadmapSave.upsert({ where: { roadmapId_userId: { roadmapId: id, userId } }, update: {}, create: { roadmapId: id, userId } });
    const saves = await t.roadmapSave.count({ where: { roadmapId: id } });
    await t.roadmapAggregates.upsert({
      where: { roadmapId: id },
      update: { savesCount: saves },
      create: { roadmapId: id, savesCount: saves },
    });
  });

  return NextResponse.json({ ok: true });
}
