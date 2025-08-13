import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const roadmap = await (prisma as any).roadmap.findFirst({ where: { slug: params.slug, published: true }, include: { user: { select: { name: true } } } });
  if (!roadmap) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(roadmap);
}
