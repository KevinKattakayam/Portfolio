import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container-grid flex min-h-[80svh] flex-col justify-center pt-32">
      <p className="text-muted">404</p>
      <h1 className="display text-step-6 mt-4">No signal here</h1>
      <p className="text-step-1 text-muted mt-6 max-w-[44ch]">
        This page doesn&apos;t exist, or it moved. The work, writing and contact details are all on
        the home page.
      </p>
      <div className="mt-10 flex gap-3">
        <Link href="/" className={buttonVariants({ variant: "ink", size: "lg" })}>
          Go to the home page
        </Link>
      </div>
    </section>
  );
}
