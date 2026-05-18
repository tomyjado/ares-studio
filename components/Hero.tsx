// components/Hero.tsx

async function getStats() {

  const groups = [35767078, 921325898, 434797992]

  let totalMembers = 0
  let totalVisits = 0
  let totalPlayers = 0

  for (const groupId of groups) {

    // GROUP INFO
    const groupRes = await fetch(
      `https://groups.roblox.com/v1/groups/${groupId}`,
      {
        cache: "no-store"
      }
    )

    const groupData = await groupRes.json()

    totalMembers += groupData.memberCount || 0

    // GAMES
    const gamesRes = await fetch(
      `https://games.roblox.com/v2/groups/${groupId}/games?accessFilter=Public&limit=50&sortOrder=Asc`,
      {
        cache: "no-store"
      }
    )

    const gamesData = await gamesRes.json()

    const universeIds = gamesData.data.map(
      (game: any) => game.id
    )

    if (universeIds.length > 0) {

      const statsRes = await fetch(
        `https://games.roblox.com/v1/games?universeIds=${universeIds.join(",")}`,
        {
          cache: "no-store"
        }
      )

      const statsData = await statsRes.json()

      for (const game of statsData.data) {

        totalVisits += game.visits || 0
        totalPlayers += game.playing || 0

      }

    }

  }

  return {
    members: format(totalMembers),
    visits: format(totalVisits),
    players: format(totalPlayers)
  }

}

function format(number: number) {

  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M+"
  }

  if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K+"
  }

  return number.toString()

}

export default async function Hero() {

  const stats = await getStats()

  return (
    <section className="h-screen flex flex-col items-center justify-center text-center px-6 relative z-30">

      <h1 className="text-7xl md:text-9xl font-black tracking-[10px] leading-none">
        <span className="text-orange-500">ARES</span> STUDIO
      </h1>

      <p className="mt-6 text-zinc-200 text-xl max-w-2xl leading-relaxed">
        Creating polished Roblox experiences with immersive gameplay,
        modern systems and highly engaging multiplayer worlds.
      </p>

      <a
        href="https://discord.gg/6XYBy7sDpM"
        target="_blank"
        rel="noopener noreferrer"
        className="
          mt-10
          bg-orange-500
          hover:bg-orange-400
          transition-all
          px-10
          py-5
          rounded-2xl
          font-bold
          text-lg
          shadow-[0_0_40px_rgba(255,120,0,0.45)]
        "
      >
        Sell Your Game
      </a>

      <div className="flex gap-10 mt-12 flex-wrap justify-center">

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-8 py-5 rounded-3xl">
          <h2 className="text-4xl font-black text-white">
            {stats.visits}
          </h2>

          <p className="text-zinc-300 mt-1">
            Total Visits
          </p>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-8 py-5 rounded-3xl">
          <h2 className="text-4xl font-black text-white">
            {stats.players}
          </h2>

          <p className="text-zinc-300 mt-1">
            Active Players
          </p>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-8 py-5 rounded-3xl">
          <h2 className="text-4xl font-black text-white">
            {stats.members}
          </h2>

          <p className="text-zinc-300 mt-1">
            Group Members
          </p>
        </div>

      </div>

      <a
        href="https://discord.gg/6XYBy7sDpM"
        target="_blank"
        rel="noopener noreferrer"
        className="
          mt-10
          text-zinc-400
          hover:text-white
          transition-all
          text-lg
        "
      >
        Discord: aonedev
      </a>

    </section>
  )
}