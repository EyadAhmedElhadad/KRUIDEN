import Link from "next/link";

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  return (
    <div className="container-editorial flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-olive-100 text-olive-700">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <h1 className="mt-6 font-serif text-3xl font-semibold text-ink md:text-4xl">
        Order placed
      </h1>
      <p className="mt-3 max-w-sm text-sm text-ink/60">
        Thank you — your ritual is on its way. We'll reach out to confirm
        delivery details shortly.
      </p>
      {searchParams.order && (
        <p className="mt-4 text-xs uppercase tracking-wide text-ink/40">
          Order Reference: {searchParams.order}
        </p>
      )}
      <Link href="/" className="btn-primary mt-8">
        Back to Home
      </Link>
    </div>
  );
}
