import Link from "next/link";

export default function Home() {
  const chapters = Array.from({ length: 11 }, (_, i) => i + 1); // adjust if you want more/less

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1>The Alchemist — Chapter Notes</h1>
      <p>Select a chapter to read and comment.</p>

      <ul>
        {chapters.map((c) => (
          <li key={c}>
            <Link href={`/chapter/${c}`}>Chapter {c}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
