async function getGames() {
  const groups = [35767078, 921325898, 434797992]

  let games: any[] = []

  for (const groupId of groups) {

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

      // THUMBNAILS
      const thumbRes = await fetch(
        `https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeIds.join(",")}&size=768x432&format=Png`
      )

      const thumbData = await thumbRes.json()

      // GAME STATS
      const statsRes = await fetch(
        `https://games.roblox.com/v1/games?universeIds=${universeIds.join(",")}`
      )

      const statsData = await statsRes.json()

      for (const thumb of thumbData.data) {

        const gameInfo = statsData.data.find(
          (g: any) => g.id === thumb.universeId
        )

        if (thumb.thumbnails?.[0]?.imageUrl) {

          games.push({
            image: thumb.thumbnails[0].imageUrl,
            name: gameInfo?.name || "Game",
            visits: gameInfo?.visits || 0,
            players: gameInfo?.playing || 0,
            placeId: gameInfo?.rootPlaceId
          })

        }

      }

    }

  }

  return games
}

function format(number: number) {

  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M"
  }

  if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K"
  }

  return number.toString()

}

export default async function Background() {

  const games = await getGames()

  const rows = [
    games,
    [...games].reverse(),
    games
  ]

  return (
    <div className="absolute inset-0 overflow-hidden">

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/75 z-10" />

      {/* MOVING ROWS */}
      <div className="absolute inset-0 flex flex-col gap-8 pt-8">

        {rows.map((row, rowIndex) => (

          <div
            key={rowIndex}
            className={`
              flex gap-6 w-max
              animate-scroll
              ${rowIndex % 2 === 0 ? "" : "animate-scroll-reverse"}
            `}
          >

            {[...row, ...row, ...row].map((game, index) => (

              <a
                key={index}
                href={`https://www.roblox.com/games/${game.placeId}`}
                target="_blank"
                className="
                  relative
                  min-w-[500px]
                  h-[280px]
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

                </div>

              </a>

            ))}

          </div>

        ))}

      </div>

    </div>
  )

}