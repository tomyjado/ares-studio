// components/GamesSection.tsx

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

        if (thumb.thumbnails?.[0]?.imageUrl) {

          games.push({
            image: thumb.thumbnails[0].imageUrl,
            name: gameInfo?.name || "Game",
            visits: gameInfo?.visits || 0,
            players: gameInfo?.playing || 0,
            description:
              gameInfo?.name +
              " is one of our immersive Roblox experiences.",
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

export default async function GamesSection() {

  const games = await getGames()

  return (
    <section
      id="games"
      className="
        relative z-30
        px-8
        pb-32
        mt-20
      "
    >

      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-14">

          <p className="text-orange-500 font-bold tracking-[4px]">
            OUR GAMES
          </p>

          <h2 className="text-5xl font-black mt-3">
            Experience Our Creations
          </h2>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

          {games.map((game, index) => (

            <div
              key={index}
              className="
                bg-black/60
                border border-white/10
                rounded-3xl
                overflow-hidden
                backdrop-blur-xl
                hover:scale-[1.02]
                transition-all
              "
            >

              <img
                src={game.image}
                className="
                  w-full
                  h-[240px]
                  object-cover
                "
              />

              <div className="p-6">

                <h2 className="text-3xl font-black">
                  {game.name}
                </h2>

                <p className="text-zinc-300 mt-4 leading-relaxed">
                  {game.description}
                </p>

                <div className="flex gap-8 mt-6 text-zinc-200">

                  <p>
                    👁 {format(game.visits)} Visits
                  </p>

                  <p>
                    👥 {format(game.players)} Players
                  </p>

                </div>

                <a
                  href={`https://www.roblox.com/games/${game.placeId}`}
                  target="_blank"
                  className="
                    mt-7
                    w-full
                    flex
                    items-center
                    justify-center
                    bg-orange-500
                    hover:bg-orange-400
                    transition-all
                    py-4
                    rounded-2xl
                    font-bold
                    text-lg
                  "
                >
                  PLAY GAME
                </a>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  )

}