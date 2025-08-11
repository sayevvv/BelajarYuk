// app/api/generate-roadmap/route.ts

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

// PERUBAHAN 1: Ganti 'week' menjadi 'timeframe'
const roadmapSchema = z.object({
  duration: z.string().describe("Estimasi durasi total pembelajaran, contoh: '3 Bulan', '6 Minggu'."),
  milestones: z.array(
    z.object({
      timeframe: z.string().describe("Jangka waktu untuk milestone ini, contoh: 'Hari 1-3', 'Minggu 1', 'Minggu 2-3'."),
      topic: z.string().describe("Topik utama yang akan dipelajari pada jangka waktu tersebut."),
      details: z.string().describe("Detail singkat atau sub-topik yang mencakup materi tersebut."),
    })
  ).describe("Daftar milestone pembelajaran."),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, details } = body;

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const parser = StructuredOutputParser.fromZodSchema(roadmapSchema);

    // PERUBAHAN 2: Perbarui prompt untuk meminta 'timeframe'
    const promptTemplate = new PromptTemplate({
        template: `Anda adalah seorang ahli perancang kurikulum. Tugas Anda adalah membuat roadmap pembelajaran yang terstruktur berdasarkan permintaan pengguna.

        Analisis permintaan pengguna berikut:
        - Topik Utama: {topic}
        - Detail Tambahan: {details}

        Lakukan proses reasoning berikut secara bertahap:
        1.  Pahami kompleksitas topik dan detailnya.
        2.  Perkirakan durasi total belajar yang realistis (misal: "3 Bulan").
        3.  Pecah topik utama menjadi beberapa "milestone" atau tahapan belajar yang logis.
        4.  Untuk setiap milestone, tentukan JANGKA WAKTU (timeframe) yang sesuai. Jangan hanya gunakan "minggu", tapi bisa juga "Hari 1-3", "Minggu 1", "Minggu 2-3", dll., tergantung pada materinya.
        5.  Tulis topik dan detail singkat untuk setiap milestone.

        Setelah selesai, hasilkan output HANYA dalam format JSON yang valid.
        
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