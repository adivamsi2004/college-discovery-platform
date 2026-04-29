import { notFound } from 'next/navigation';
import { prisma } from '../../../lib/db';

interface CollegePageProps {
  params: {
    slug: string;
  };
}

const formatCurrency = (value: number) => `₹${value.toLocaleString()}`;

export default async function CollegeDetailPage({ params }: CollegePageProps) {
  const collegeRaw = await prisma.college.findUnique({
    where: { slug: params.slug },
  });

  if (!collegeRaw) {
    notFound();
  }

  const college = {
    ...collegeRaw,
    courses: JSON.parse(collegeRaw.courses) as string[],
    highlights: JSON.parse(collegeRaw.highlights),
  };

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 sm:px-8">
      <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-card">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-600">College profile</p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900">{college.name}</h1>
            <p className="mt-3 text-lg text-slate-600">{college.overview}</p>
          </div>

          <div className="rounded-3xl bg-slate-50 p-6">
            <div className="space-y-4 text-sm text-slate-700">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Location</h2>
                <p>{college.location}</p>
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">Fees</h2>
                <p>{formatCurrency(college.fees)}</p>
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">Rating</h2>
                <p>{college.rating.toFixed(1)} / 5</p>
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">Placement</h2>
                <p>{college.placementRate}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 p-6">
            <h2 className="text-2xl font-semibold text-slate-900">Courses offered</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Explore programs and degree pathways available at this college.
            </p>
            <ul className="mt-6 grid gap-3">
              {college.courses.map((course) => (
                <li key={course} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {course}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-slate-200 p-6">
            <h2 className="text-2xl font-semibold text-slate-900">Placements</h2>
            <div className="mt-6 space-y-4 text-sm text-slate-600">
              <div className="rounded-3xl border border-slate-200 bg-white p-4">
                <p className="text-base font-semibold text-slate-900">Placement rate</p>
                <p>{college.placementRate}% of students placed</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-4">
                <p className="text-base font-semibold text-slate-900">Average salary</p>
                <p>{(college.highlights as any).averageSalary}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-4">
                <p className="text-base font-semibold text-slate-900">Admission deadline</p>
                <p>{(college.highlights as any).admissionDeadline}</p>
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-slate-200 p-6">
          <h2 className="text-2xl font-semibold text-slate-900">Student reviews</h2>
          <div className="mt-6 grid gap-4">
            {['Focused curriculum', 'Strong placement support', 'Excellent campus life'].map((review) => (
              <article key={review} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">{review}</p>
                <p className="mt-2 text-slate-600">“This college helped me build practical skills and connect with recruiters.”</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
