import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fetching colleges from API...');
  const res = await fetch('http://universities.hipolabs.com/search?country=India');
  const data = await res.json();

  console.log(`Fetched ${data.length} universities. Formatting data...`);

  const coursesList = [
    'Computer Science', 'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering',
    'Business Administration', 'Data Science', 'Information Technology', 'Architecture',
    'Law', 'Medicine', 'Pharmacy', 'Biotechnology', 'Psychology', 'Economics'
  ];

  const collegesToInsert = [];
  const seenSlugs = new Set();

  for (const uni of data) {
    const slug = uni.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    // Avoid duplicate slugs
    if (seenSlugs.has(slug) || !slug) continue;
    seenSlugs.add(slug);

    // Mock random stats
    const fees = Math.floor(Math.random() * 800000) + 100000; // 1L to 9L
    const rating = (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1); // 3.5 to 5.0
    const placementRate = Math.floor(Math.random() * 40) + 60; // 60% to 100%

    // Pick 3 random courses
    const shuffledCourses = [...coursesList].sort(() => 0.5 - Math.random());
    const selectedCourses = shuffledCourses.slice(0, 3);

    const location = uni['state-province'] || 'India';
    
    const overview = `Welcome to ${uni.name}. A premier institution located in ${location}, offering a variety of undergraduate and postgraduate programs with excellent industry connections.`;
    
    const highlights = {
      averageSalary: `${(Math.random() * 10 + 4).toFixed(1)} LPA`,
      studentStrength: Math.floor(Math.random() * 15000) + 2000,
      admissionDeadline: 'August 15',
    };

    collegesToInsert.push({
      name: uni.name,
      slug: slug,
      location: location,
      fees: fees,
      rating: parseFloat(rating),
      placementRate: placementRate,
      courses: JSON.stringify(selectedCourses),
      overview: overview,
      highlights: JSON.stringify(highlights),
    });
  }

  console.log(`Clearing existing colleges...`);
  await prisma.college.deleteMany();

  console.log(`Inserting ${collegesToInsert.length} colleges into the database...`);
  // SQLite doesn't support skipDuplicates, but we already filtered unique slugs.
  // Insert in batches just in case there's a limit
  const batchSize = 100;
  for (let i = 0; i < collegesToInsert.length; i += batchSize) {
    const batch = collegesToInsert.slice(i, i + batchSize);
    await prisma.college.createMany({
      data: batch,
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
