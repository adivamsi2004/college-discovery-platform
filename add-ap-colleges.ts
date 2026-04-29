import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const apColleges = [
  { name: 'Andhra University', location: 'Visakhapatnam, Andhra Pradesh' },
  { name: 'Indian Institute of Technology (IIT) Tirupati', location: 'Tirupati, Andhra Pradesh' },
  { name: 'National Institute of Technology (NIT) Andhra Pradesh', location: 'Tadepalligudem, Andhra Pradesh' },
  { name: 'GITAM (Gandhi Institute of Technology and Management)', location: 'Visakhapatnam, Andhra Pradesh' },
  { name: 'K L University (Koneru Lakshmaiah Education Foundation)', location: 'Vijayawada, Andhra Pradesh' },
  { name: 'Vignan Foundation for Science, Technology and Research', location: 'Guntur, Andhra Pradesh' },
  { name: 'SRM University, Andhra Pradesh', location: 'Amaravati, Andhra Pradesh' },
  { name: 'Jawaharlal Nehru Technological University (JNTU) Kakinada', location: 'Kakinada, Andhra Pradesh' },
  { name: 'Jawaharlal Nehru Technological University (JNTU) Anantapur', location: 'Anantapur, Andhra Pradesh' },
  { name: 'Sri Venkateswara University', location: 'Tirupati, Andhra Pradesh' },
  { name: 'Indian Institute of Information Technology (IIIT) Sri City', location: 'Chittoor, Andhra Pradesh' },
  { name: 'VIT-AP University', location: 'Amaravati, Andhra Pradesh' },
  { name: 'G Pulla Reddy Engineering College', location: 'Kurnool, Andhra Pradesh' },
  { name: 'Sree Vidyanikethan Engineering College', location: 'Tirupati, Andhra Pradesh' },
  { name: 'Gayatri Vidya Parishad College of Engineering', location: 'Visakhapatnam, Andhra Pradesh' }
];

async function main() {
  console.log('Adding Andhra Pradesh colleges...');
  
  const coursesList = [
    'Computer Science', 'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering',
    'Business Administration', 'Data Science', 'Information Technology', 'Architecture'
  ];

  const collegesToInsert = [];

  for (const uni of apColleges) {
    const slug = uni.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const fees = Math.floor(Math.random() * 600000) + 150000;
    const rating = (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1);
    const placementRate = Math.floor(Math.random() * 30) + 70; 

    const shuffledCourses = [...coursesList].sort(() => 0.5 - Math.random());
    const selectedCourses = shuffledCourses.slice(0, 4);
    
    const overview = `Welcome to ${uni.name}. A top-rated institution located in ${uni.location}, providing excellent academic programs and world-class infrastructure.`;
    
    const highlights = {
      averageSalary: `${(Math.random() * 8 + 5).toFixed(1)} LPA`,
      studentStrength: Math.floor(Math.random() * 10000) + 3000,
      admissionDeadline: 'July 20',
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
    } catch (e) {
      console.log('Skipping duplicate:', c.name);
    }
  }

  console.log('Successfully added Andhra Pradesh colleges!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
