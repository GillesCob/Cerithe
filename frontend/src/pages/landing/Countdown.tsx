import { useState, useEffect } from "react"

interface ITimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const TARGET_DATE = new Date("2026-07-17T00:00:00")

function calcTimeLeft(): ITimeLeft | null {
  const diff = TARGET_DATE.getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

const UNITS: [string, keyof ITimeLeft][] = [
  ["JJ", "days"],
  ["HH", "hours"],
  ["MM", "minutes"],
  ["SS", "seconds"],
]

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<ITimeLeft | null>(calcTimeLeft)

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calcTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!timeLeft) {
    return (
      <p className="font-display text-3xl font-semibold text-cerithe-coral">
        En production
      </p>
    )
  }

  return (
    <div className="flex items-end justify-center gap-6 md:gap-10">
      {UNITS.map(([label, key]) => (
        <div key={label} className="flex flex-col items-center gap-2">
          <span className="font-display text-5xl md:text-7xl font-bold text-cerithe-coral tabular-nums leading-none">
            {String(timeLeft[key]).padStart(2, "0")}
          </span>
          <span className="text-xs font-medium tracking-widest text-white/40 uppercase">
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
