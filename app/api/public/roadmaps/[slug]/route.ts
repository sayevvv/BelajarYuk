import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const revalidate = 60; // seconds

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const roadmap = await (prisma as any).roadmap.findFirst({ where: { slug, published: true }, include: { user: { select: { name: true } } } });
  if (!roadmap) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(roadmap);
}
