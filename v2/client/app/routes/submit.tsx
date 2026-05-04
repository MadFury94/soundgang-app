import type { MetaFunction } from 'react-router'

export const meta: MetaFunction = () => [
  { title: 'Submit Music | SoundGang' },
  {
    name: 'description',
    content: 'Submit your music to SoundGang for review by our A&R team.'
  }
]

export default function SubmitPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24 sm:px-8">
      <p className="text-sm uppercase tracking-[0.2em] text-[#8B9D7F]">Submit Music</p>
      <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Share Your Sound</h1>
      <p className="mt-6 text-lg leading-relaxed text-gray-300">
        Submission workflow scaffold is ready for your form fields and upload flow.
      </p>
      <div className="mt-10 rounded-2xl border border-dashed border-gray-700 p-10 text-gray-400">
        Submission form scaffold ready.
      </div>
    </section>
  )
}
