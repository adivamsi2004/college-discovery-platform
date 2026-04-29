import Link from 'next/link';
import { College } from '@prisma/client';

type Props = {
  college: College;
};

const CollegeCard = ({ college }: Props) => {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{college.name}</h2>
          <p className="mt-2 text-sm text-slate-600">{college.location}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {college.rating.toFixed(1)} ⭐
        </span>
      </div>

      <div className="mt-5 text-sm text-slate-600">
        <p>Fees: ₹{college.fees.toLocaleString()}</p>
        <p>Placement: {college.placementRate}%</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {college.courses.slice(0, 3).map((course) => (
          <span key={course} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
            {course}
          </span>
        ))}
      </div>

      <Link
        href={`/colleges/${college.slug}`}
        className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
      >
        View details
      </Link>
    </article>
  );
};

export default CollegeCard;
