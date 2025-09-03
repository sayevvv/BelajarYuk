import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth.config";
import { PrismaClient } from "@prisma/client";
import { assertSameOrigin } from "@/lib/security";

const prisma = new PrismaClient();

export async function GET(_req: NextRequest, ctx: any) {
  const { id } = await (ctx as any).params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const roadmap = await (prisma as any).roadmap.findFirst({
    where: { id, userId: session.user.id },
    include: { progress: true, user: { select: { name: true, image: true, id: true } } },
  });
  if (!roadmap) return NextResponse.json({ error: "Not found" }, { status: 404 });
  // Attach minimal source info if this is a forked roadmap
  let source: any = null;
  try {
    if ((roadmap as any).sourceId) {
      source = await (prisma as any).roadmap.findUnique({ where: { id: (roadmap as any).sourceId }, select: { id: true, published: true, slug: true, title: true, user: { select: { id: true, name: true, image: true } } } });
    }
  } catch {}
  return NextResponse.json({ ...(roadmap as any), source });
}

export async function DELETE(_req: NextRequest, ctx: any) {
  const { id } = await (ctx as any).params;
  try { assertSameOrigin(_req as any); } catch (e: any) { return NextResponse.json({ error: 'Forbidden' }, { status: e?.status || 403 }); }
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await (prisma as any).roadmap.findFirst({ where: { id, userId: session.user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await (prisma as any).roadmap.delete({ where: { id } });
  return NextResponse.json({ ok: true }, { status: 200 });
}
