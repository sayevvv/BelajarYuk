import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth.config";
import { PrismaClient } from "@prisma/client";
import { assertSameOrigin } from "@/lib/security";

const prisma = new PrismaClient();

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(req: NextRequest, ctx: any) {
  try { assertSameOrigin(req as any); } catch (e: any) { return NextResponse.json({ error: 'Forbidden' }, { status: e?.status || 403 }); }
  const { id } = await (ctx as any).params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { publish } = await req.json();

  const roadmap = await prisma.roadmap.findFirst({ where: { id, userId: session.user.id } });
  if (!roadmap) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (publish) {
    // Enforce: user can only publish if progress is 100%
    const progress = await (prisma as any).roadmapProgress.findUnique({ where: { roadmapId: roadmap.id } });
    const percent = typeof progress?.percent === 'number' ? progress.percent : 0;
    if (percent < 100) {
      return NextResponse.json({ error: "Progress harus 100% untuk mempublikasikan", percent }, { status: 400 });
    }
    if ((roadmap as any).sourceId) {
      return NextResponse.json({ error: "Forked roadmap cannot be published" }, { status: 400 });
    }
    // ensure unique slug
    let base = slugify(roadmap.title);
    if (!base) base = `roadmap-${roadmap.id.slice(0, 6)}`;
    let slug = base;
    let i = 1;
  while (await (prisma as any).roadmap.findFirst({ where: { slug } })) {
      slug = `${base}-${i++}`;
    }
  const updated = await (prisma as any).roadmap.update({ where: { id: roadmap.id }, data: { published: true, slug, publishedAt: new Date() } });
    // Revalidate public cache tags
    try {
      revalidateTag('public-roadmaps');
      revalidateTag(`public-roadmap:${updated.slug}`);
    } catch {}
    return NextResponse.json(updated);
  } else {
  const updated = await (prisma as any).roadmap.update({ where: { id: roadmap.id }, data: { published: false, publishedAt: null } });
    try {
      revalidateTag('public-roadmaps');
      if (updated.slug) revalidateTag(`public-roadmap:${updated.slug}`);
    } catch {}
    return NextResponse.json(updated);
  }
}
