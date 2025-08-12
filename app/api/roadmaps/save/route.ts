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

    const newRoadmap = await prisma.roadmap.create({
      data: {
        title,
        content,
        userId: session.user.id, // Gunakan id dari sesi yang sudah terverifikasi
      },
    });

    return NextResponse.json(newRoadmap, { status: 201 });

  } catch (error) {
    console.error("Error saving roadmap:", error);
    return NextResponse.json({ error: "Failed to save roadmap." }, { status: 500 });
  }
}