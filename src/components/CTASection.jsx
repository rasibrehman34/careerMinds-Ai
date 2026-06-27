import Button from './Button'

export default function CTASection() {
  return (
    <section className="py-16 sm:py-20" aria-labelledby="cta-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-3xl border border-stone-200 bg-white px-6 py-12 text-center dark:border-zinc-800 dark:bg-zinc-900 sm:px-10 sm:py-16">
          <h2
            id="cta-heading"
            className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl"
          >
            Ready to explore your future?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
            Start asking career questions today and discover degrees, paths, and skills
            that fit your goals.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button to="/chat" size="lg">
              Start Chat
            </Button>
            <Button to="/signup" variant="accent" size="lg">
              Create Free Account
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
