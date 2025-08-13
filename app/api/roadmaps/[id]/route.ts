import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth.config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const roadmap = await (prisma as any).roadmap.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: { progress: true, user: { select: { name: true, image: true } } },
  });
  if (!roadmap) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(roadmap);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await (prisma as any).roadmap.findFirst({ where: { id: params.id, userId: session.user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await (prisma as any).roadmap.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true }, { status: 200 });
}
