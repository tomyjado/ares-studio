// components/ContributedGames.tsx

async function getGames() {

  const groups = [
    230250709,
    587378400,
    927579712,
    14943317,
    35814365,
    232873193
  ]

  let games: any[] = []

  let totalVisits = 0
  let totalPlayers = 0
  let totalMembers = 0

  for (const groupId of groups) {

    try {

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

        const thumbRes = await fetch(
          `https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeIds.join(",")}&size=768x432&format=Png`
        )

        const thumbData = await thumbRes.json()

        const statsRes = await fetch(
          `https://games.roblox.com/v1/games?universeIds=${universeIds.join(",")}`
        )

        const statsData = await statsRes.json()

        for (const thumb of thumbData.data) {

          const gameInfo = statsData.data.find(
            (g: any) => g.id === thumb.universeId
          )

          // HIDE EMPTY GAMES
          if (
            !gameInfo ||
            gameInfo.playing <= 0 ||
            !thumb.thumbnails?.[0]?.imageUrl
          ) continue

          totalVisits += gameInfo.visits || 0
          totalPlayers += gameInfo.playing || 0

          games.push({
            image: thumb.thumbnails[0].imageUrl,
            name: gameInfo?.name || "Game",
            visits: gameInfo?.visits || 0,
            players: gameInfo?.playing || 0,
            placeId: gameInfo?.rootPlaceId
          })

        }

      }

    } catch (err) {
      console.log(err)
    }

  }

  return {
    games,
    totalVisits,
    totalPlayers,
    totalMembers
  }

}

function format(number: number) {

  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(1) + "B+"
  }

  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M+"
  }

  if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K+"
  }

  return number.toString()

}

export default async function ContributedGames() {

  const {
    games,
    totalVisits,
    totalPlayers,
    totalMembers
  } = await getGames()

  return (
    <section className="relative z-30 py-10 overflow-hidden">

      <div className="max-w-7xl mx-auto px-8">

        <div className="text-center mb-10">

          <p className="text-orange-500 font-bold tracking-[4px]">
            CONTRIBUTED GAMES
          </p>

          <h2 className="text-5xl font-black mt-3">
            Projects We Contributed To
          </h2>

          {/* STATS */}
          <div className="flex gap-8 justify-center flex-wrap mt-10">

            <div className="bg-black/40 border border-white/10 backdrop-blur-xl px-8 py-5 rounded-3xl">
              <h2 className="text-4xl font-black">
                {format(totalVisits)}
              </h2>

              <p className="text-zinc-300 mt-1">
                Total Visits
              </p>
            </div>

            <div className="bg-black/40 border border-white/10 backdrop-blur-xl px-8 py-5 rounded-3xl">
              <h2 className="text-4xl font-black">
                {format(totalPlayers)}
              </h2>

              <p className="text-zinc-300 mt-1">
                Active Players
              </p>
            </div>

            <div className="bg-black/40 border border-white/10 backdrop-blur-xl px-8 py-5 rounded-3xl">
              <h2 className="text-4xl font-black">
                {format(totalMembers)}
              </h2>

              <p className="text-zinc-300 mt-1">
                Group Members
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* GAMES */}
      <div className="flex gap-8 w-max animate-scroll">

        {[...games, ...games, ...games].map((game, index) => (

          <a
            key={index}
            href={`https://www.roblox.com/games/${game.placeId}`}
            target="_blank"
            className="
              relative
              min-w-[420px]
              h-[240px]
              rounded-3xl
              overflow-hidden
              border border-white/10
              hover:scale-[1.03]
              transition-all
            "
          >

            <img
              src={game.image}
              className="
                absolute inset-0
                w-full h-full
                object-cover
              "
            />

            <div className="absolute inset-0 bg-black/45" />

            <div className="absolute bottom-0 left-0 right-0 p-5 z-20">

              <h2 className="text-white text-2xl font-bold">
                {game.name}
              </h2>

              <div className="flex gap-6 mt-2 text-zinc-200">

                <p>
                  👁 {format(game.visits)} Visits
                </p>

                <p>
                  👥 {format(game.players)} Playing
                </p>

              </div>

              <div
                className="
                  mt-4
                  inline-flex
                  bg-orange-500
                  px-5
                  py-2
                  rounded-xl
                  font-bold
                "
              >
                PLAY GAME
              </div>

            </div>

          </a>

        ))}

      </div>

    </section>
  )

}