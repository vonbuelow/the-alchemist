import Link from "next/link";

type ChapterLink = {
  num: number;
  label: string;
};

const chapters: ChapterLink[] = [
  { num: 1, label: "Part One — Section 1" },
  { num: 2, label: "Part One — Section 2" },
  { num: 3, label: "Part One — Section 3" },
  { num: 4, label: "Part One — Section 4" },
  { num: 5, label: "Part Two — Section 5" },
  { num: 6, label: "Part Two — Section 6" },
  { num: 7, label: "Part Two — Section 7" },
  { num: 8, label: "Part Two — Section 8" },
  { num: 9, label: "Part Two — Section 9" },
  { num: 10, label: "Part Two — Section 10" },
  { num: 11, label: "Part Two — Section 11" },
];

const DARK_BLUE = "#003153";
const HOVER_BLUE = "#89CFF0";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "64px 20px",
        display: "flex",
        justifyContent: "center",
        color: "white",
      }}
    >
      <style>{`
        .chapter-card {
          display: block;
          border-radius: 16px;
          padding: 16px;
          background: ${DARK_BLUE};
          color: white;
          text-decoration: none;
          transition:
            transform 160ms ease,
            background-color 160ms ease,
            box-shadow 160ms ease;
          will-change: transform;
          cursor: pointer;
        }

        /* Desktop hover */
        @media (hover: hover) and (pointer: fine) {
          .chapter-card:hover {
            background: ${HOVER_BLUE};
            transform: scale(1.035);
            box-shadow: 0 14px 30px rgba(0, 0, 0, 0.35);
          }
        }

        /* Touch / click feedback */
        .chapter-card:active {
          background: ${HOVER_BLUE};
          transform: scale(0.98);
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.35);
        }

        .chapter-card:focus-visible {
          outline: 2px solid white;
          outline-offset: 4px;
        }
      `}</style>

      <div style={{ width: "100%", maxWidth: 900 }}>
        <header style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 44, margin: 0 }}>
            The Alchemist — Book Club!
          </h1>
          <p style={{ marginTop: 10, fontSize: 16, opacity: 0.9 }}>
            Pick a chapter and share your thoughts.
          </p>
        </header>

        <section
          style={{
            borderRadius: 18,
            padding: 20,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 14,
            }}
          >
            {chapters.map((c) => (
              <Link
                key={c.num}
                href={`/chapter/${c.num}`}
                className="chapter-card"
              >
                <div style={{ fontSize: 12, opacity: 0.85 }}>
                  Chapter {c.num}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    marginTop: 6,
                  }}
                >
                  {c.label}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    marginTop: 12,
                    opacity: 0.85,
                  }}
                >
                  Open notes →
                </div>
              </Link>
            ))}
          </div>
        </section>

        <footer style={{ marginTop: 18, fontSize: 12, opacity: 0.85 }}>
          <span>
            Tip: use your magic link once, then you can comment quickly on any
            chapter.{" "}
          </span>
          <a
            href="https://youtu.be/oHg5SJYRHA0?si=_Fokzf-0RF5iR7Dv"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "inherit",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Trust the omens.
          </a>
        </footer>
      </div>
    </main>
  );
}
