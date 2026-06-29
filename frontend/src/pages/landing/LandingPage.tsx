import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Countdown from "./Countdown";
import StackBadges from "./StackBadges";

const SOLUTION_CARDS = [
  {
    title: "Transmission sécurisée",
    desc: "Passez la main à un nouveau propriétaire avec un carnet complet et structuré, en quelques clics.",
  },
  {
    title: "Historique d'interventions",
    desc: "Chaque travaux, diagnostic ou passage d'un artisan est tracé, daté et rattaché au bien.",
  },
  {
    title: "Suivi réglementaire",
    desc: "Restez informé des obligations de conformité liées à votre bien et anticipez les échéances.",
  },
];

export default function LandingPage() {
  const portfolioUrl = import.meta.env.VITE_PORTFOLIO_URL;

  return (
    <div className="min-h-screen bg-cerithe-cream">
      {/* 1 — Hero */}
      <section className="bg-cerithe-navy flex flex-col items-center justify-center min-h-[60vh] px-6 py-20 text-center">
        <img src="/logo-cerithe.png" alt="Cerithe" className="max-h-[400px] w-auto mb-10 object-contain" />
        <h1 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight max-w-2xl">
          Carnet de santé numérique du bâtiment
        </h1>
      </section>

      {/* 2 — Histoire du nom */}
      <section className="relative overflow-hidden bg-cerithe-cream px-6 py-24">
        <ShellDecoration />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-cerithe-navy mb-8">Pourquoi Cerithe&nbsp;?</h2>
          <p className="text-lg md:text-xl leading-relaxed text-cerithe-navy/75 italic">
            Le cerithe est un coquillage très répandu sur les plages, souvent choisi par le bernard l'hermite comme première
            maison. Au fil de l'évolution de ses besoins, le bernard l'hermite change de coquille, comme nous changeons d'habitat
            au fil de nos vies. Le nom Cerithe sonne aussi comme{" "}
            <span className="not-italic font-semibold text-cerithe-coral">«&nbsp;s'hérite&nbsp;»</span>
            {" "} parce qu'un bâtiment se transmet et avec lui toute son histoire.
          </p>
        </div>
      </section>

      {/* 3 — Problème */}
      <section className="bg-white px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-cerithe-navy mb-6">Le problème</h2>
          <p className="text-base md:text-lg text-cerithe-gray leading-relaxed">
            À chaque changement de propriétaire ou de gestionnaire, l'historique d'un bâtiment disparaît&nbsp;: travaux réalisés,
            diagnostics, interventions, conformités,... tout se perd dans la transmission. Le nouveau propriétaire repart de zéro,
            sans aucun fil conducteur sur l'état réel du bien qu'il vient d'acquérir.
          </p>
        </div>
      </section>

      {/* 4 — Solution */}
      <section className="bg-cerithe-cream px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-cerithe-navy mb-10">La solution</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {SOLUTION_CARDS.map((item) => (
              <Card key={item.title}>
                <CardContent>
                  <div className="w-8 h-0.5 bg-cerithe-coral mb-4 rounded-full" />
                  <h3 className="font-display font-semibold text-cerithe-navy mb-3 text-sm leading-snug">{item.title}</h3>
                  <p className="text-sm text-cerithe-gray leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5 & 6 — Statut + Countdown */}
      <section className="bg-cerithe-navy px-6 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <Badge className="mb-6 bg-cerithe-coral/15 text-cerithe-coral border-cerithe-coral/30 hover:bg-cerithe-coral/15">
            MVP en développement
          </Badge>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-white mb-2">Mise en production prévue</h2>
          <p className="text-white/50 mb-14 text-sm tracking-widest uppercase">17 juillet 2026</p>
          <Countdown />
        </div>
      </section>

      {/* 7 — Stack technique */}
      <section className="bg-white px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-cerithe-navy mb-10">Stack technique</h2>
          <StackBadges />
        </div>
      </section>

      {/* 8 — Liens */}
      <section className="bg-cerithe-cream px-6 py-20">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-display text-2xl font-semibold text-cerithe-navy mb-3">Suivre le projet</h2>
          <p className="text-cerithe-gray text-sm mb-10">Le code est ouvert. Le projet avance en public.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-cerithe-navy text-white hover:bg-cerithe-navy/85 h-11 px-6 font-medium">
              <a href="https://github.com/GillesCob/Cerithe" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-cerithe-navy text-cerithe-navy hover:bg-cerithe-navy hover:text-white h-11 px-6 font-medium transition-colors"
            >
              <a href={`${portfolioUrl}/articles?tag=cerithe`} target="_blank" rel="noopener noreferrer">
                Suivre le développement
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* 9 — Footer */}
      <footer className="bg-cerithe-navy px-6 py-8 text-center">
        <p className="text-white/40 text-sm">
          Construit par{" "}
          <a
            href="https://gillescobigo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-cerithe-coral transition-colors"
          >
            Gilles Cobigo
          </a>{" "}
          — gillescobigo.com
        </p>
      </footer>
    </div>
  );
}

function ShellDecoration() {
  const whorls = [
    { y: 20, rx: 4, ry: 4 },
    { y: 34, rx: 8, ry: 5 },
    { y: 50, rx: 13, ry: 6 },
    { y: 68, rx: 18, ry: 7 },
    { y: 88, rx: 23, ry: 7 },
    { y: 109, rx: 27, ry: 8 },
    { y: 130, rx: 30, ry: 8 },
    { y: 152, rx: 31, ry: 7 },
    { y: 172, rx: 29, ry: 7 },
    { y: 190, rx: 23, ry: 6 },
    { y: 204, rx: 15, ry: 5 },
    { y: 215, rx: 8, ry: 4 },
  ];

  return (
    <svg
      viewBox="0 0 100 230"
      fill="none"
      aria-hidden="true"
      className="absolute right-4 md:right-16 top-1/2 -translate-y-1/2 h-[75%] max-h-72 w-auto pointer-events-none select-none text-cerithe-navy opacity-[0.07]"
    >
      {whorls.map(({ y, rx, ry }, i) => (
        <ellipse key={i} cx={50} cy={y} rx={rx} ry={ry} fill="currentColor" />
      ))}
    </svg>
  );
}
