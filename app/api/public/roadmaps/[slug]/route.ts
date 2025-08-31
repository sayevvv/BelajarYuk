import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // seconds

export async function GET(_req: NextRequest, ctx: any) {
  try {
  const { slug } = await (ctx as any).params;
  const roadmap = await (prisma as any).roadmap.findFirst({ where: { slug, published: true }, include: { user: { select: { name: true, id: true } } } });
    if (!roadmap) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(roadmap, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }
}
