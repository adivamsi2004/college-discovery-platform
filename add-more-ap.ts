import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const specificColleges = [
  { 
    name: 'PACE Institute of Technology and Sciences', 
    location: 'Ongole, Andhra Pradesh',
    customHighlight: 'Highly professional faculty and good technical training.'
  },
  {
    name: 'Rise Krishna Sai Gandhi Group of Institutions',
    location: 'Ongole, Andhra Pradesh',
    customHighlight: 'Strong focus on technical education and campus life.'
  },
  {
    name: 'Krishna Chaitanya Institute of Technology & Sciences',
    location: 'Markapur, Andhra Pradesh',
    customHighlight: 'Often listed for civil and mechanical engineering.'
  },
  {
    name: 'Malineni Lakshmaiah Engineering College',
    location: 'Singarayakonda, Andhra Pradesh',
    customHighlight: 'Frequently recommended for computer science specializations.'
  }
];

async function main() {
  console.log('Adding specific colleges to the database...');
  
  const coursesList = [
    'Computer Science & Engineering', 'Electronics & Communication', 'Mechanical Engineering', 
    'Civil Engineering', 'Information Technology', 'Artificial Intelligence & Data Science'
  ];

  const collegesToInsert = [];

  for (const uni of specificColleges) {
    const slug = uni.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    // Randomize some fields to ensure realistic displays
    const fees = Math.floor(Math.random() * 200000) + 150000;
    const rating = (Math.random() * (4.5 - 3.8) + 3.8).toFixed(1);
    const placementRate = Math.floor(Math.random() * 20) + 75; 

    // Shuffle and pick courses
    const shuffledCourses = [...coursesList].sort(() => 0.5 - Math.random());
    const selectedCourses = shuffledCourses.slice(0, 4);
    
    const overview = `Welcome to ${uni.name}. A top-rated institution located in ${uni.location}. ${uni.customHighlight}`;
    
    const highlights = {
      averageSalary: `${(Math.random() * 5 + 3).toFixed(1)} LPA`,
      studentStrength: Math.floor(Math.random() * 3000) + 1500,
      admissionDeadline: 'August 15',
    };

    collegesToInsert.push({
      name: uni.name,
      slug: slug,
      location: uni.location,
      fees: fees,
      rating: parseFloat(rating),
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
      console.log(`Added: ${c.name}`);
    } catch (e) {
      console.log('Skipping duplicate:', c.name);
    }
  }

  console.log('Successfully added the new colleges!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
