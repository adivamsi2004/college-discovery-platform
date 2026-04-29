'use client';

import { useEffect, useMemo, useState } from 'react';
import CollegeCard from '../components/CollegeCard';
import EmptyState from '../components/EmptyState';
import FilterBar from '../components/FilterBar';

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

type ApiResponse = {
  colleges: College[];
  total: number;
  page: number;
  pageSize: number;
  locations: string[];
  courses: string[];
};

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [course, setCourse] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams();
    if (search) query.set('search', search);
    if (location) query.set('location', location);
    if (course) query.set('course', course);
    query.set('page', String(page));
    query.set('facets', 'true');

    fetch(`/api/colleges?${query.toString()}`)
      .then((res) => res.json())
      .then((payload) => setData(payload))
      .finally(() => setLoading(false));
  }, [search, location, course, page]);

  const totalPages = useMemo(() => {
    if (!data) return 1;
    return Math.max(1, Math.ceil(data.total / data.pageSize));
  }, [data]);

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-10 px-6 py-10 sm:px-8">
      <section className="space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-sky-600">College discovery</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Find the right college, compare fast decisions.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Browse colleges by rating, location, fees, and courses. Use compare mode to evaluate top choices.
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-card">
          <FilterBar
            search={search}
            location={location}
            course={course}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            onLocationChange={(value) => {
              setLocation(value);
              setPage(1);
            }}
            onCourseChange={(value) => {
              setCourse(value);
              setPage(1);
            }}
            locations={data?.locations ?? []}
            courses={data?.courses ?? []}
          />
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">College results</h2>
            <p className="mt-1 text-sm text-slate-600">
              {data ? `Showing ${data.colleges.length} of ${data.total} colleges` : 'Loading colleges...'}
            </p>
          </div>
          <div className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
            Compare colleges on the next page
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600">Loading...</div>
        ) : data && data.colleges.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {data.colleges.map((college) => (
              <CollegeCard key={college.id} college={college as any} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}

        {data && totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-5 shadow-card">
            <div className="text-sm text-slate-600">
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-3">
              <button
                disabled={page === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                className="rounded-full border border-slate-200 bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
