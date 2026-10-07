import { labEntries, labIdentityLine } from "@/content/site";

export default function LabPage() {
  return (
    <main>
      <div>
        Route: /lab — {labEntries.length} experiments. {labIdentityLine}
      </div>
    </main>
  );
}
