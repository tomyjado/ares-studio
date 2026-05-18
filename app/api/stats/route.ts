import { NextResponse } from "next/server"

const GROUP_IDS = [35767078, 921325898]

export async function GET() {

  let totalMembers = 0
  let totalVisits = 0
  let totalPlayers = 0

  for (const groupId of GROUP_IDS) {

    const groupRes = await fetch(
      `https://groups.roblox.com/v1/groups/${groupId}`
    )

    const groupData = await groupRes.json()

    totalMembers += groupData.memberCount || 0

    const gamesRes = await fetch(
      `https://games.roblox.com/v2/groups/${groupId}/games?accessFilter=Public&limit=50&sortOrder=Asc`
    )

    const gamesData = await gamesRes.json()

    const universeIds = gamesData.data.map(
      (game: any) => game.id
    )

    if (universeIds.length > 0) {

      const statsRes = await fetch(
        `https://games.roblox.com/v1/games?universeIds=${universeIds.join(",")}`
      )

      const statsData = await statsRes.json()

      for (const game of statsData.data) {
        totalVisits += game.visits || 0
        totalPlayers += game.playing || 0
      }

    }

  }

  return NextResponse.json({
    visits: format(totalVisits),
    active: format(totalPlayers),
    members: format(totalMembers)
  })

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
