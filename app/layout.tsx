import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Xaymaca",
    template: "%s | Xaymaca",
  },
  description:
    "Xaymaca (XAY) is a community-governed digital asset ecosystem focused on participation, staking, and transparent governance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
