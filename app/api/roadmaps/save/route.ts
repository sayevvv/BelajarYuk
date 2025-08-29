import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"; // Impor getServerSession
import { authOptions } from "@/auth.config";      // Impor authOptions yang sudah kita buat
import { prisma } from "@/lib/prisma";
import crypto from 'crypto';
import { assertSameOrigin } from "@/lib/security";

export async function POST(req: NextRequest) {
  try { assertSameOrigin(req as any); } catch (e: any) { return NextResponse.json({ error: 'Forbidden' }, { status: e?.status || 403 }); }
  // Gunakan getServerSession dengan authOptions untuk mendapatkan sesi
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    // Jika tidak ada sesi atau user id, tolak permintaan
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Missing title or content" }, { status: 400 });
    }

    // Pastikan user benar-benar ada di database untuk menghindari FK error
    let userId = session.user.id as string;
    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user && session.user.email) {
      const byEmail = await prisma.user.findUnique({ where: { email: session.user.email } });
      if (byEmail) {
        user = byEmail;
        userId = byEmail.id;
      }
    }
    if (!user) {
      return NextResponse.json({ error: "User not found. Please sign in again." }, { status: 401 });
    }

    // Idempotency: compute content hash
    let hash: string | null = null;
    try { hash = crypto.createHash('sha256').update(JSON.stringify(content ?? {})).digest('hex'); } catch {}

    if (hash) {
      const same = await (prisma as any).roadmap.findFirst({ where: { userId, title, contentHash: hash }, include: { progress: true }, orderBy: { createdAt: 'desc' } });
      if (same) return NextResponse.json(same, { status: 200, headers: { 'x-deduped': 'true' } });
    } else {
      // Fallback JSON compare if hash not available
      const lastSameTitle = await (prisma as any).roadmap.findFirst({ where: { userId, title }, orderBy: { createdAt: 'desc' }, include: { progress: true } });
      if (lastSameTitle) {
        try {
          const a = JSON.stringify(lastSameTitle.content ?? {});
          const b = JSON.stringify(content ?? {});
          if (a === b) return NextResponse.json(lastSameTitle, { status: 200, headers: { 'x-deduped': 'true' } });
        } catch {}
      }
    }

  const newRoadmap = await (prisma as any).roadmap.create({
      data: {
        title,
        content,
    contentHash: hash,
        userId, // id yang terverifikasi benar-benar ada di DB
        progress: {
          create: {
            completedTasks: {},
            percent: 0,
          },
        },
      },
      include: { progress: true },
    });

    return NextResponse.json(newRoadmap, { status: 201 });

  } catch (error) {
    console.error("Error saving roadmap:", error);
    return NextResponse.json({ error: "Failed to save roadmap." }, { status: 500 });
  }
}