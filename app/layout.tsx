import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Web3Provider } from "@/components/web3-provider";
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
      <body>
        <Web3Provider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </Web3Provider>
      </body>
    </html>
  );
}
