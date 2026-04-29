const EmptyState = ({ message = 'No colleges match the selected filters.' }: { message?: string }) => {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-8 py-10 text-center text-slate-700">
      <p className="text-lg font-semibold">Nothing to show</p>
      <p className="mt-2 text-sm text-slate-600">{message}</p>
    </div>
  );
};

export default EmptyState;
