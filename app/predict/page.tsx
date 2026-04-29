'use client';

import { useMemo, useState } from 'react';

type College = {
  id: number;
  name: string;
  location: string;
  fees: number;
  rating: number;
  placementRate: number;
  slug: string;
};

type PredictorResponse = {
  exam: string;
  rank: number;
  recommended: College[];
  message: string;
};

export default function PredictorPage() {
  const [exam, setExam] = useState('jee');
  const [rank, setRank] = useState('');
  const [result, setResult] = useState<PredictorResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => rank.trim().length > 0 && Number(rank) > 0, [rank]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    const response = await fetch(`/api/predict?exam=${encodeURIComponent(exam)}&rank=${encodeURIComponent(rank)}`);
    const payload = await response.json();
    setResult(payload);
    setLoading(false);
  };

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10 sm:px-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-card">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Predictor tool</p>
          <h1 className="text-4xl font-semibold text-slate-900">Find colleges based on your exam rank.</h1>
          <p className="text-slate-600">Enter your exam type and rank to see a rule-based college recommendation list.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Exam</span>
            <select
              value={exam}
              onChange={(event) => setExam(event.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
            >
              <option value="jee">JEE</option>
              <option value="neet">NEET</option>
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-700">Rank</span>
            <input
              type="number"
              value={rank}
              onChange={(event) => setRank(event.target.value)}
              placeholder="Enter your rank"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="sm:col-span-3 rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Finding colleges…' : 'Get recommendations'}
          </button>
        </form>

        {result && (
          <section className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-2xl font-semibold text-slate-900">Recommendations</h2>
            <p className="mt-2 text-sm text-slate-600">{result.message}</p>
            <div className="mt-6 grid gap-4">
              {result.recommended.map((college) => (
                <div key={college.id} className="rounded-3xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{college.name}</p>
                      <p className="mt-1 text-sm text-slate-600">{college.location}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">Rating {college.rating.toFixed(1)}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                    <span>Fees ₹{college.fees.toLocaleString()}</span>
                    <span>Placement {college.placementRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
