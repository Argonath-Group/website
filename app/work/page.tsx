import { workEntries } from "@/content/site";

export default function WorkPage() {
  return (
    <main>
      <div>Route: /work — work archive ({workEntries.length} entries)</div>
    </main>
  );
}
