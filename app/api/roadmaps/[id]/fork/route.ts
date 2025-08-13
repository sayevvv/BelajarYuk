import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth.config";
import { prisma } from "@/lib/prisma";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const source = await (prisma as any).roadmap.findFirst({ where: { id: params.id, published: true } });
  if (!source) return NextResponse.json({ error: "Source not found or not published" }, { status: 404 });
  if (source.userId === session.user.id) return NextResponse.json({ error: "Cannot save your own roadmap" }, { status: 400 });

  const cloned = await (prisma as any).roadmap.create({
    data: {
      title: source.title,
      content: source.content as any,
      userId: session.user.id,
  sourceId: source.id,
      published: false,
      slug: null,
      publishedAt: null,
      progress: { create: { completedTasks: {}, percent: 0 } },
    },
    include: { progress: true },
  });

  return NextResponse.json(cloned, { status: 201 });
}
