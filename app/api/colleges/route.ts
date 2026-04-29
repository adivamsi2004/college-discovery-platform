import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const search = url.searchParams.get('search') ?? '';
  const location = url.searchParams.get('location') ?? '';
  const course = url.searchParams.get('course') ?? '';
  const page = Number(url.searchParams.get('page') ?? '1');
  const limit = 8;
  const skip = Math.max(0, page - 1) * limit;
  const facets = url.searchParams.get('facets') === 'true';

  let allCollegesRaw = await prisma.college.findMany({
    orderBy: [{ rating: 'desc' }, { fees: 'asc' }],
  });

  const allColleges = allCollegesRaw.map((c) => ({
    ...c,
    courses: JSON.parse(c.courses),
    highlights: JSON.parse(c.highlights),
  }));

  let filteredColleges = allColleges;
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredColleges = filteredColleges.filter(c => c.name.toLowerCase().includes(searchLower));
  }
  if (location) {
    filteredColleges = filteredColleges.filter(c => c.location === location);
  }
  if (course) {
    filteredColleges = filteredColleges.filter(c => c.courses.includes(course));
  }

  const count = filteredColleges.length;
  const colleges = filteredColleges.slice(skip, skip + limit);

  const locations = facets
    ? Array.from(new Set(allColleges.map((item) => item.location).filter(Boolean)))
    : [];
  const coursesList = facets
    ? Array.from(new Set(allColleges.flatMap((item) => item.courses).filter(Boolean)))
    : [];

  return NextResponse.json({
    colleges,
    total: count,
    page,
    pageSize: limit,
    locations,
    courses: coursesList,
  });
}
