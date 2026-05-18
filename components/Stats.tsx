async function getStats() {
  const res = await fetch("http://localhost:3000/api/stats", {
    cache: "no-store"
  })

  return res.json()
}

export default async function Stats() {
  const stats = await getStats()

  return (
    <section className="pb-24 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8">
          <h2 className="text-zinc-400 text-sm">TOTAL VISITS</h2>
          <p className="text-4xl font-bold mt-2">
            {stats.visits}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8">
          <h2 className="text-zinc-400 text-sm">ACTIVE PLAYERS</h2>
          <p className="text-4xl font-bold mt-2">
            {stats.active}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8">
          <h2 className="text-zinc-400 text-sm">GROUP MEMBERS</h2>
          <p className="text-4xl font-bold mt-2">
            {stats.members}
          </p>
        </div>

      </div>
    </section>
  )
}
