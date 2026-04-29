'use client';

import { FormEvent } from 'react';

type Props = {
  search: string;
  location: string;
  course: string;
  onSearchChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onCourseChange: (value: string) => void;
  locations: string[];
  courses: string[];
};

const FilterBar = ({
  search,
  location,
  course,
  onSearchChange,
  onLocationChange,
  onCourseChange,
  locations,
  courses,
}: Props) => {
  return (
    <form className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr]" onSubmit={(event: FormEvent) => event.preventDefault()}>
      <label className="block w-full">
        <span className="sr-only">Search colleges</span>
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by college name"
          className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">Location</span>
        <select
          value={location}
          onChange={(event) => onLocationChange(event.target.value)}
          className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
        >
          <option value="">All locations</option>
          {locations.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">Course</span>
        <select
          value={course}
          onChange={(event) => onCourseChange(event.target.value)}
          className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
        >
          <option value="">All courses</option>
          {courses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
    </form>
  );
};

export default FilterBar;
