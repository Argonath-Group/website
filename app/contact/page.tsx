import { contactCopy } from "@/content/site";

export default function ContactPage() {
  return (
    <main>
      <div>
        Route: /contact — {contactCopy.heading} · {contactCopy.email}
      </div>
    </main>
  );
}
