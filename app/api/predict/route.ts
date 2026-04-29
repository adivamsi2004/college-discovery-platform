import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

const rankings = [
  { maxRank: 4000, maxFee: 500000, minRating: 4.5 },
  { maxRank: 10000, maxFee: 420000, minRating: 4.2 },
  { maxRank: 20000, maxFee: 360000, minRating: 4.0 },
  { maxRank: 50000, maxFee: 320000, minRating: 3.6 },
];

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const rank = Number(url.searchParams.get('rank') ?? '0');
  const exam = url.searchParams.get('exam') ?? 'jee';

  const bucket = rankings.find((item) => rank > 0 && rank <= item.maxRank) ?? rankings[rankings.length - 1];
  const recommended = await prisma.college.findMany({
    where: {
      fees: { lte: bucket.maxFee },
      rating: { gte: bucket.minRating },
    },
    orderBy: [{ rating: 'desc' }, { fees: 'asc' }],
    take: 5,
  });

  return NextResponse.json({ exam, rank, recommended, message: `Suggested colleges for ${exam.toUpperCase()} rank ${rank}.` });
}
