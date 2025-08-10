export default function Spinner() {
  return (
    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent text-brand-500 align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  )
}
