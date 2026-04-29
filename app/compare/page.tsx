'use client';

import { useEffect, useState } from 'react';

type College = {
  id: number;
  name: string;
  slug: string;
  location: string;
  fees: number;
  rating: number;
  placementRate: number;
  courses: string[];
};

export default function ComparePage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/colleges?facets=true&page=1')
      .then((res) => res.json())
      .then((payload) => setColleges(payload.colleges))
      .finally(() => setLoading(false));
  }, []);

  const selectedColleges = colleges.filter((college) => selected.includes(college.slug));

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 sm:px-8">
      <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-card">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-sky-600">College comparison</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-900">Compare 2–3 colleges side by side.</h1>
          <p className="mt-3 text-slate-600">
            Choose colleges and compare fees, ratings, placement percentage, and location to decide quickly.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600">Loading colleges…</div>
          ) : (
            colleges.map((college) => (
              <label
                key={college.slug}
                className="cursor-pointer rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:bg-slate-100"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(college.slug)}
                  onChange={(event) => {
                    const checked = event.target.checked;
                    setSelected((current) => {
                      if (checked) {
                        return current.length >= 3 ? current : [...current, college.slug];
                      }
                      return current.filter((slug) => slug !== college.slug);
                    });
                  }}
                  className="mr-3 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <span className="text-base font-semibold text-slate-900">{college.name}</span>
                <p className="mt-2 text-sm text-slate-600">{college.location}</p>
              </label>
            ))
          )}
        </div>

        <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          {selectedColleges.length < 2 ? (
            <p className="text-sm text-slate-600">Select at least 2 colleges to compare.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead>
                  <tr>
                    <th className="border-b border-slate-200 px-4 py-3 text-slate-900">Metric</th>
                    {selectedColleges.map((college) => (
                      <th key={college.slug} className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-900">
                        {college.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Location', (college: College) => college.location],
                    ['Fees', (college: College) => `₹${college.fees.toLocaleString()}`],
                    ['Rating', (college: College) => college.rating.toFixed(1)],
                    ['Placement', (college: College) => `${college.placementRate}%`],
                    ['Top courses', (college: College) => college.courses.slice(0, 3).join(', ')],
                  ].map(([label, value]) => (
                    <tr key={label}>
                      <td className="border-b border-slate-200 px-4 py-3 font-medium text-slate-700">{label}</td>
                      {selectedColleges.map((college) => (
                        <td key={`${college.slug}-${label}`} className="border-b border-slate-200 px-4 py-3 text-slate-600">
                          {value(college as College)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
