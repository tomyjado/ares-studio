import "./globals.css"

export const metadata = {
  title: "ARES STUDIO",
  description: "Roblox Studio Website"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}