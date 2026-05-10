import Link from 'next/link'

function CaseCard({
  number,
  title,
  body,
  imagePosition,
  className,
}: {
  number: string
  title: string
  body: string
  imagePosition: string
  className: string
}) {
  return (
    <article className={`flex min-h-[342px] flex-col items-center rounded-[32px] border border-gray-700/80 bg-[#fffdf8] px-7 pb-5 pt-8 text-center shadow-[0_13px_0_#070707] ${className}`}>
      <p className="mb-3 font-mono text-sm font-bold text-brand">{number}</p>
      <h2 className="max-w-[210px] text-[1.55rem] font-black leading-[1.08] tracking-[0] text-black">
        {title}
      </h2>
      <p className="mt-3 max-w-[235px] text-[1.02rem] leading-[1.27] text-[#34363c]">{body}</p>
      <div
        aria-hidden="true"
        className="mt-auto h-[175px] w-full bg-[url('/landing/case-illustrations.png')] bg-[length:300%_auto] bg-no-repeat"
        style={{ backgroundPosition: imagePosition }}
      />
    </article>
  )
}

export default function HomePage() {
  return (
    <div className="-mx-4 -mt-px flex flex-col bg-[#fffdf8] text-black sm:-mx-8 md:h-[calc(100svh-45px)] md:overflow-hidden">
      <section className="mx-auto flex h-full w-full max-w-[1480px] flex-col items-center px-5 pt-8 text-center sm:px-8 lg:pt-9">
        <h1
          className="max-w-[1420px] font-mono font-semibold tracking-[0]"
          style={{ fontSize: 'clamp(3rem, 4.15vw, 5rem)', lineHeight: 1.08 }}
        >
          <span className="inline md:whitespace-nowrap">
            Master finance{' '}
            <span className="relative inline-block bg-brand/12 px-5 text-brand">
              <span className="absolute -left-[3px] top-0 h-full w-[3px] bg-brand" />
              <span className="absolute -left-[10px] -top-[10px] h-5 w-5 rounded-full bg-brand" />
              <span className="absolute -right-[3px] bottom-0 h-full w-[3px] bg-brand" />
              <span className="absolute -bottom-[10px] -right-[10px] h-5 w-5 rounded-full bg-brand" />
              Mini Cases.
            </span>
          </span>
          <br />
          <span>Pass faster.</span>
        </h1>

        <div className="mt-7 flex justify-center">
          <Link href="/kurse" className="btn-brand flex h-12 items-center gap-4 rounded-lg bg-brand px-6 text-base font-bold text-white shadow-[inset_0_1px_0_rgb(255_255_255_/_0.25)] hover:bg-brand-dark">
            Start learning
            <span aria-hidden="true" className="text-2xl leading-none">{'->'}</span>
          </Link>
        </div>

        <div className="mt-9 grid w-full max-w-[990px] grid-cols-1 items-end gap-5 md:grid-cols-3 md:gap-7">
          <CaseCard
            number="01"
            title="All finance cases in one place"
            body="Find every course, unit, and Mini Case without digging through PDFs."
            imagePosition="left center"
            className="origin-bottom md:rotate-[-4deg]"
          />
          <CaseCard
            number="02"
            title="Step-by-step solutions"
            body="Understand the calculation logic, not just the final number."
            imagePosition="center center"
            className="hidden md:flex relative z-10 md:min-h-[350px]"
          />
          <CaseCard
            number="03"
            title="Built for exam prep"
            body="Practice by unit and repeat the cases that matter most."
            imagePosition="right center"
            className="hidden md:flex origin-bottom md:rotate-[4deg]"
          />
        </div>
      </section>
    </div>
  )
}
