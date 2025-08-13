// app/api/generate-roadmap/route.ts

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

// Skema Zod diperbarui untuk meminta data advanced
const roadmapSchema = z.object({
  duration: z.string().describe("Estimasi durasi total pembelajaran, contoh: '3 Bulan', '6 Minggu'."),
  milestones: z.array(
    z.object({
      timeframe: z.string().describe("Jangka waktu yang spesifik dan realistis untuk milestone ini, contoh: 'Minggu 1', 'Minggu 2-3', '2 Akhir Pekan'."),
      topic: z.string().describe("Topik utama yang akan dipelajari pada jangka waktu tersebut."),
      sub_tasks: z.array(z.string()).describe("Daftar 3-5 tugas atau poin pembelajaran yang spesifik dan actionable untuk milestone ini."),
      estimated_dates: z.string().describe("Estimasi rentang tanggal untuk milestone ini, contoh: '12 Agu - 18 Agu 2025'. Kosongkan jika tidak ada informasi tanggal dari pengguna."),
      daily_duration: z.string().describe("Estimasi durasi belajar harian untuk milestone ini, contoh: '2 jam/hari'. Kosongkan jika tidak ada informasi dari pengguna."),
    })
  ).describe("Daftar milestone pembelajaran."),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, details, promptMode } = body;

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const parser = StructuredOutputParser.fromZodSchema(roadmapSchema);

    // Prompt yang diperbarui untuk menghasilkan output advanced
    const promptTemplate = new PromptTemplate({
        template: `Anda adalah seorang ahli perancang kurikulum. Tugas Anda adalah membuat roadmap pembelajaran yang sangat detail dan realistis berdasarkan permintaan dan batasan pengguna.

        Analisis permintaan pengguna berikut:
        - Topik Utama: {topic}
        - Detail dan Batasan: {details}

        Lakukan proses reasoning berikut:
        1.  Pahami topik utama dan tujuan akhir pengguna dari detail yang diberikan.
        2.  Perhatikan batasan waktu yang diberikan: periode belajar, hari yang tersedia, dan durasi belajar maksimal per hari.
        3.  Pecah topik menjadi beberapa "milestone" yang logis.
        4.  Untuk setiap milestone:
            a. Alokasikan **timeframe** yang realistis (misal: "Minggu 1").
            b. Buat daftar **sub_tasks** yang spesifik dan bisa dikerjakan (3-5 poin).
            c. Jika pengguna memberikan informasi di mode advanced, hitung dan sertakan **estimated_dates** (rentang tanggal) dan **daily_duration** (durasi harian) untuk milestone ini. Jika tidak ada informasi, biarkan kosong.
        
        Hasil akhir HARUS memperhitungkan semua batasan yang diberikan pengguna untuk membuat jadwal yang bisa mereka ikuti.
        
        Hasilkan output HANYA dalam format JSON yang valid.
        
        {format_instructions}
        
        Permintaan Pengguna:
        Topic: {topic}
        Details: {details}`,
        inputVariables: ["topic", "details"],
        partialVariables: { format_instructions: parser.getFormatInstructions() },
    });
    
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-flash-latest",
      apiKey: process.env.GOOGLE_API_KEY,
      temperature: 0.5,
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ]
    });
    
    const chain = promptTemplate.pipe(model).pipe(parser);

    const result = await chain.invoke({
      topic: topic,
      details: details || "Tidak ada detail tambahan, buatkan untuk pemula.",
    });

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error("Error generating roadmap:", error);
    return NextResponse.json({ error: "Failed to generate roadmap." }, { status: 500 });
  }
}
