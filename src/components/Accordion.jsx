import { useState } from 'react'

export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0)

  function toggleItem(index) {
    setOpenIndex((current) => (current === index ? -1 : index))
  }

  return (
    <div className="divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
      {items.map((item, index) => {
        const isOpen = openIndex === index

        return (
          <article key={item.question}>
            <h3>
              <button
                type="button"
                onClick={() => toggleItem(index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-medium text-zinc-900 transition-colors hover:bg-stone-50 dark:text-zinc-100 dark:hover:bg-zinc-800/60 sm:px-6 sm:py-5"
              >
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className={`shrink-0 text-emerald-800 transition-transform dark:text-emerald-400 ${isOpen ? 'rotate-45' : ''}`}
                >
                  +
                </span>
              </button>
            </h3>
            {isOpen && (
              <div className="px-5 pb-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:px-6 sm:pb-6">
                {item.answer}
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}
