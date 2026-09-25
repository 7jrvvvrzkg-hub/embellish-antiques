export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <span className="text-xs font-semibold uppercase tracking-widest text-pop-dark">Our story</span>
      <h1 className="mt-2 font-display text-4xl">About Embellish Antiques</h1>

      <div className="mt-8 space-y-5 leading-relaxed text-ink-soft">
        <p>
          Embellish Antiques is owned and operated by Akin Kolawole. Akin got his start in
          the antiques business working part-time while still in college at an antiques
          store in Brookline, MA over 25 years ago. Having been bitten by the antiques
          bug, he decided to get into the business upon graduation.
        </p>
        <p>
          He opened his store on Charles Street in Boston and operated it there for over
          15 years. After closing that store, he decided to move down to North Carolina,
          where he now runs the business.
        </p>
        <p>
          His warehouse in Durham, NC is filled with an extensive array of one-of-a-kind
          items personally selected and curated by Akin. If you don&apos;t see what
          you&apos;re searching for, please{" "}
          <a href="/contact" className="font-medium text-pop-dark underline underline-offset-2 hover:text-pop">
            contact us
          </a>{" "}
          — there&apos;s a good chance we have it and haven&apos;t posted it to the
          website yet.
        </p>
        <p>
          Follow along with new arrivals on Instagram{" "}
          <a
            href="https://www.instagram.com/embellishantiques/"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-pop-dark underline underline-offset-2 hover:text-pop"
          >
            @embellishantiques
          </a>
          .
        </p>
      </div>
    </div>
  );
}
