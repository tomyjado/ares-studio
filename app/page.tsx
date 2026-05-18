// app/page.tsx

import Hero from "../components/Hero"
import Background from "../components/Background"
import GamesSection from "../components/GamesSection"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">

      <Background />

      <div className="relative z-20">
        <Hero />
        <GamesSection />
      </div>

    </main>
  )
}