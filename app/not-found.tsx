import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col justify-center py-28">
      <p className="font-mono text-meta uppercase tracking-wide text-accent">
        Error 404
      </p>
      <h1 className="mt-6 font-display text-display-1">Nothing here.</h1>
      <p className="mt-8 max-w-md text-body-lg text-gray-600">
        The page you were looking for has moved, or never existed. The rest
        of the studio is intact.
      </p>
      <p className="mt-10">
        <Link
          href="/"
          className="font-mono text-meta uppercase tracking-wide text-accent underline underline-offset-4"
        >
          ← Back to the studio
        </Link>
      </p>
    </Container>
  );
}
