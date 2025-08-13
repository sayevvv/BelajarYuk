import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"; // Impor getServerSession
import { authOptions } from "@/auth.config";      // Impor authOptions yang sudah kita buat
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  // Gunakan getServerSession dengan authOptions untuk mendapatkan sesi
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    // Jika tidak ada sesi atau user id, tolak permintaan
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, content } = body;

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

    const newRoadmap = await (prisma as any).roadmap.create({
      data: {
        title,
        content,
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