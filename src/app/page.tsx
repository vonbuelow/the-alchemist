import Link from "next/link";

type WeekLink = {
  num: number;
  label: string;
  pages: string;
};

const weeks: WeekLink[] = [
  { num: 1, label: "Week 1", pages: "pp. 1–36" },
  { num: 2, label: "Week 2", pages: "pp. 37–72" },
  { num: 3, label: "Week 3", pages: "pp. 73–108" },
  { num: 4, label: "Week 4", pages: "pp. 109–144" },
  { num: 5, label: "Week 5", pages: "pp. 145–171" },
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
        .week-card {
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
          .week-card:hover {
            background: ${HOVER_BLUE};
            transform: scale(1.035);
            box-shadow: 0 14px 30px rgba(0, 0, 0, 0.35);
          }
        }

        /* Touch / click feedback */
        .week-card:active {
          background: ${HOVER_BLUE};
          transform: scale(0.98);
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.35);
        }

        .week-card:focus-visible {
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
            Pick a week and share your thoughts.
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
            {weeks.map((w) => (
              <Link
                key={w.num}
                href={`/week/${w.num}`}
                className="week-card"
              >
                <div style={{ fontSize: 12, opacity: 0.85 }}>
                  {w.label}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    marginTop: 6,
                  }}
                >
                  {w.pages}
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
            week.{" "}
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
