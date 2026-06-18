import { useState } from "react";

interface ISkill {
  name: string;
  theory: number;
  practice: number;
  project: string;
}

interface ICategory {
  label: string;
  theory: number;
  practice: number;
  skills: ISkill[];
}

const categories: ICategory[] = [
  {
    label: "Backend",
    theory: 80,
    practice: 75,
    skills: [
      { name: "Express / Node.js", theory: 80, practice: 75, project: "Cerithe" },
      { name: "Auth JWT + argon2", theory: 85, practice: 80, project: "Cerithe" },
      { name: "Prisma + PostgreSQL", theory: 80, practice: 78, project: "Cerithe" },
      { name: "Zod (validation)", theory: 75, practice: 72, project: "Cerithe" },
      { name: "REST API design", theory: 78, practice: 75, project: "Cerithe" },
    ],
  },
  {
    label: "Frontend",
    theory: 72,
    practice: 68,
    skills: [
      { name: "React + TypeScript", theory: 75, practice: 70, project: "Cerithe / Nexio" },
      { name: "Zustand", theory: 70, practice: 68, project: "ChouxFleurs2" },
      { name: "TanStack Query", theory: 65, practice: 60, project: "Nexio" },
      { name: "React Hook Form", theory: 72, practice: 68, project: "Cerithe" },
      { name: "Tailwind + shadcn/ui", theory: 70, practice: 65, project: "Nexio" },
    ],
  },
  {
    label: "Agentique",
    theory: 70,
    practice: 65,
    skills: [
      { name: "Claude Code", theory: 72, practice: 65, project: "ChouxFleurs2 / Nexio" },
      { name: "Prompting structuré", theory: 75, practice: 68, project: "Tous projets" },
      { name: "CLAUDE.md / règles", theory: 70, practice: 62, project: "Nexio" },
      { name: "Plan mode + review", theory: 68, practice: 60, project: "Nexio" },
    ],
  },
  {
    label: "DevOps",
    theory: 55,
    practice: 45,
    skills: [
      { name: "Docker", theory: 55, practice: 40, project: "VPS Hetzner" },
      { name: "Nginx", theory: 52, practice: 38, project: "VPS Hetzner" },
      { name: "Linux / SSH", theory: 55, practice: 45, project: "VPS Hetzner" },
      { name: "CI/CD GitHub Actions", theory: 45, practice: 25, project: "à venir" },
    ],
  },
  {
    label: "Métier",
    theory: 90,
    practice: 92,
    skills: [
      { name: "Vision produit / BIM", theory: 95, practice: 95, project: "10 ans BTP" },
      { name: "Communication", theory: 90, practice: 92, project: "Mareterra Monaco" },
      { name: "Gestion de projet", theory: 88, practice: 90, project: "Mareterra Monaco" },
      { name: "Analyse des besoins", theory: 92, practice: 90, project: "Tous projets" },
    ],
  },
  {
    label: "TypeScript",
    theory: 68,
    practice: 62,
    skills: [
      { name: "Types de base", theory: 80, practice: 78, project: "Cerithe" },
      { name: "Generics", theory: 45, practice: 30, project: "en cours" },
      { name: "Déclaration de module", theory: 72, practice: 68, project: "Cerithe" },
      { name: "exactOptionalProperty", theory: 55, practice: 50, project: "Cerithe" },
    ],
  },
];

const W = 480;
const H = 400;
const cx = 240;
const cy = 210;
const R = 160;
const LEVELS = 5;

function getAngle(i: number, n: number): number {
  return (Math.PI * 2 * i) / n - Math.PI / 2;
}

function getPoint(i: number, val: number, n: number): [number, number] {
  const a = getAngle(i, n);
  const r = R * (val / 100);
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function toPolyPoints(values: number[], n: number): string {
  return values.map((val, i) => getPoint(i, val, n).join(",")).join(" ");
}

const THEORY_STROKE = "#4A90D9";
const THEORY_FILL = "rgba(74,144,217,0.12)";
const PRACTICE_STROKE = "#E8734A";
const PRACTICE_FILL = "rgba(232,115,74,0.12)";
const GRID_COLOR = "rgba(0,0,0,0.08)";
const TEXT_COLOR = "#555";

export default function SkillsRadar() {
  const [selected, setSelected] = useState<number | null>(null);
  const n = categories.length;

  const theoryValues = categories.map((c) => c.theory);
  const practiceValues = categories.map((c) => c.practice);

  function handleClick(idx: number): void {
    setSelected(selected === idx ? null : idx);
  }

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 640, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          gap: 20,
          marginBottom: 12,
          fontSize: 13,
          color: "#666",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <span>
          <span
            style={{
              display: "inline-block",
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: THEORY_STROKE,
              marginRight: 6,
            }}
          />
          Théorique
        </span>
        <span>
          <span
            style={{
              display: "inline-block",
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: PRACTICE_STROKE,
              marginRight: 6,
            }}
          />
          Pratique
        </span>
        <span style={{ color: "#999", fontStyle: "italic" }}>Cliquer sur une section pour le détail</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", cursor: "pointer" }}>
        {Array.from({ length: LEVELS }, (_, l) => (
          <polygon
            key={l}
            points={toPolyPoints(Array(n).fill((l + 1) * 20), n)}
            fill="none"
            stroke={GRID_COLOR}
            strokeWidth={0.8}
          />
        ))}

        {categories.map((_, i) => {
          const [x2, y2] = getPoint(i, 100, n);
          return <line key={i} x1={cx} y1={cy} x2={x2} y2={y2} stroke={GRID_COLOR} strokeWidth={0.8} />;
        })}

        <polygon
          points={toPolyPoints(theoryValues, n)}
          fill={THEORY_FILL}
          stroke={THEORY_STROKE}
          strokeWidth={2}
          strokeLinejoin="round"
        />

        <polygon
          points={toPolyPoints(practiceValues, n)}
          fill={PRACTICE_FILL}
          stroke={PRACTICE_STROKE}
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeDasharray="5,3"
        />

        {categories.map((cat, i) => {
          const [lx, ly] = getPoint(i, 118, n);
          const a = (getAngle(i, n) * 180) / Math.PI;
          let anchor: "middle" | "start" | "end" = "middle";
          if (a > 30 && a < 150) anchor = "start";
          if (a < -30 || a > 150) anchor = "end";

          const [px, py] = getPoint(i, cat.theory, n);

          return (
            <g key={i} onClick={() => handleClick(i)}>
              <text
                x={lx}
                y={ly}
                textAnchor={anchor}
                fontSize={13}
                fill={selected === i ? THEORY_STROKE : TEXT_COLOR}
                fontWeight={selected === i ? "600" : "500"}
              >
                {cat.label}
              </text>
              <circle
                cx={px}
                cy={py}
                r={selected === i ? 6 : 4}
                fill={selected === i ? THEORY_STROKE : "#fff"}
                stroke={THEORY_STROKE}
                strokeWidth={2}
              />
            </g>
          );
        })}
      </svg>

      {selected !== null && (
        <div
          style={{
            marginTop: 20,
            background: "#fff",
            border: "0.5px solid rgba(0,0,0,0.1)",
            borderRadius: 12,
            padding: "1.25rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <p style={{ fontWeight: 600, fontSize: 15, margin: 0 }}>{categories[selected].label}</p>
            <span style={{ fontSize: 12, color: "#999" }}>théorie / pratique</span>
          </div>

          {categories[selected].skills.map((s, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 0",
                borderBottom: idx < categories[selected].skills.length - 1 ? "0.5px solid rgba(0,0,0,0.08)" : "none",
              }}
            >
              <span style={{ fontSize: 13, minWidth: 150, color: "#333" }}>{s.name}</span>

              <div
                style={{
                  flex: 1,
                  height: 6,
                  background: "#f0f0f0",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${s.theory}%`,
                    height: "100%",
                    background: THEORY_STROKE,
                    borderRadius: 3,
                  }}
                />
              </div>
              <span style={{ fontSize: 12, color: "#666", minWidth: 26, textAlign: "right" }}>{s.theory}</span>

              <div
                style={{
                  flex: 1,
                  height: 6,
                  background: "#f0f0f0",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${s.practice}%`,
                    height: "100%",
                    background: PRACTICE_STROKE,
                    borderRadius: 3,
                  }}
                />
              </div>
              <span style={{ fontSize: 12, color: "#666", minWidth: 26, textAlign: "right" }}>{s.practice}</span>

              <span
                style={{
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 6,
                  background: "#f5f5f5",
                  color: "#888",
                  whiteSpace: "nowrap",
                }}
              >
                {s.project}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
