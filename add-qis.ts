import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const specificColleges = [
  { 
    name: 'QIS College of Engineering and Technology (Autonomous)', 
    location: 'Ongole, Prakasam District, Andhra Pradesh' 
  }
];

async function main() {
  console.log('Adding specific colleges...');
  
  const coursesList = [
    'Computer Science & Engineering', 'Electronics & Communication', 'Mechanical Engineering', 
    'Civil Engineering', 'Information Technology', 'Artificial Intelligence & Data Science'
  ];

  const collegesToInsert = [];

  for (const uni of specificColleges) {
    const slug = uni.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const fees = 200000;
    const rating = 4.2;
    const placementRate = 85; 

    const selectedCourses = coursesList;
    
    const overview = `Welcome to ${uni.name}. A top-rated autonomous institution located in ${uni.location}, providing excellent academic programs, modern infrastructure, and strong placement opportunities.`;
    
    const highlights = {
      averageSalary: `4.5 LPA`,
      studentStrength: 4000,
      admissionDeadline: 'August 10',
    };

    collegesToInsert.push({
      name: uni.name,
      slug: slug,
      location: uni.location,
      fees: fees,
      rating: rating,
      placementRate: placementRate,
      courses: JSON.stringify(selectedCourses),
      overview: overview,
      highlights: JSON.stringify(highlights),
    });
  }

  for (const c of collegesToInsert) {
    try {
      await prisma.college.upsert({
        where: { slug: c.slug },
        update: {},
        create: c
      });
    } catch (e) {
      console.log('Skipping duplicate:', c.name);
    }
  }

  console.log('Successfully added QIS College!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
