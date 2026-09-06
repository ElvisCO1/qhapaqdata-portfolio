"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function CryptoError({ reset }: { reset: () => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <section className="panel empty-state" role="alert">
      <h1 className="text-2xl">Market data is temporarily unavailable</h1>
      <p className="muted mt-3">
        We could not retrieve the latest snapshot. Please try again shortly.
      </p>
      <button
        className="button mt-5"
        disabled={pending}
        onClick={() =>
          startTransition(() => {
            router.refresh();
            reset();
          })
        }
      >
        {pending ? "Retrying…" : "Try again"}
      </button>
    </section>
  );
}
