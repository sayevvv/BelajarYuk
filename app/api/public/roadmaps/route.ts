import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || undefined;
  const sort = (searchParams.get('sort') || 'newest').toLowerCase();
  const page = Math.max(Number(searchParams.get('page') || 1), 1);
  const pageSize = Math.min(Math.max(Number(searchParams.get('pageSize') || 12), 1), 50);
  const take = pageSize;
  const skip = (page - 1) * pageSize;

  let orderBy: any = { publishedAt: 'desc' };
  if (sort === 'oldest') orderBy = { publishedAt: 'asc' };
  else if (sort === 'title_asc') orderBy = { title: 'asc' };
  else if (sort === 'title_desc') orderBy = { title: 'desc' };

  const where: any = { published: true, ...(q ? { title: { contains: q, mode: 'insensitive' as const } } : {}) };
  const [items, total] = await Promise.all([
  (prisma as any).roadmap.findMany({ where, orderBy, take, skip, select: { id: true, userId: true, title: true, slug: true, publishedAt: true, user: { select: { name: true } }, content: true } }),
  (prisma as any).roadmap.count({ where }),
  ]);

  const totalPages = Math.max(Math.ceil(total / pageSize), 1);
  return NextResponse.json({ items, total, page, pageSize, totalPages });
}
