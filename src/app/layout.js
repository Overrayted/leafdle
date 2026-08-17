import "./globals.css";

export const metadata = {
  title: "Leafdle | The Daily Maple Leafs Player Guessing Game",
  description: "Test your Toronto Maple Leafs knowledge daily with Leafdle.ca!",
  icons: {
    icon: "https://assets.nhle.com/logos/nhl/svg/TOR_light.svg",
    shortcut: "https://assets.nhle.com/logos/nhl/svg/TOR_light.svg",
    apple: "https://assets.nhle.com/logos/nhl/svg/TOR_light.svg",
  },
  openGraph: {
    title: "Leafdle.ca",
    description: "The Daily Maple Leafs Player Guessing Game",
    url: "https://leafdle.ca",
    siteName: "Leafdle",
    images: [
      {
        url: "https://assets.nhle.com/logos/nhl/svg/TOR_light.svg",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_CA",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased">{children}</body>
    </html>
  );
}