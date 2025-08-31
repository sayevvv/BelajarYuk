import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest) {
  // Prefer DB topics; fall back to empty list if table missing
  try {
    const rows = await (prisma as any).topic.findMany({ orderBy: [{ name: 'asc' }] });
    return NextResponse.json({ topics: rows.map((t: any) => ({ id: t.id, slug: t.slug, name: t.name })) });
  } catch (e) {
    return NextResponse.json({ topics: [] });
  }
}
