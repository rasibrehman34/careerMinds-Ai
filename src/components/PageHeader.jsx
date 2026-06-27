export default function PageHeader({ title, description }) {
  return (
    <header className="mb-10 text-center sm:mb-12">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
          {description}
        </p>
      )}
    </header>
  )
}
