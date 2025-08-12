// lib/prisma.ts

import { PrismaClient } from '@prisma/client'

// Deklarasikan variabel global untuk menyimpan cache instance prisma
declare global {
  var prisma: PrismaClient | undefined
}

// Buat instance prisma, gunakan cache jika ada di environment development
// untuk menghindari pembuatan instance baru setiap kali ada hot-reload.
export const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}