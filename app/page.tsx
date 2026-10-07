import { homeCopy } from "@/content/site";

export default function HomePage() {
  return (
    <main>
      <div>Route: / — {homeCopy.hero.headline}</div>
    </main>
  );
}
