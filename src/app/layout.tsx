import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Viewport } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import Navigation from "./_components/navigation";
import { Providers } from "./_components/providers";
import PageFooter from "./_components/page-footer";
import { auth } from "@/server/auth";
import SignupForm from "./_components/signup-form";
import LoginForm from "./_components/login-form";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

export const viewport: Viewport = {
  themeColor: [
    // { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  initialScale: 1,
  viewportFit: "cover",
  width: "device-width",
};

export const generateMetadata = async () => {
  return {
    title: "Subscription Manager",
    authors: [
      {
        name: "Dawid Oleksiuk",
      },
    ],
    creator: "Dawid Oleksiuk Scrumbuiss",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    description: "Best subscription manager app",
    applicationName: "Subscription Manager",
    keywords: [
      "best subscription manager app",
      "subscription",
      "manager",
      "subscription manager",
      "subscription-manager",
      "management",
      "best subscription manager app",
    ],
    publisher: "Subscription Manager",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
    openGraph: {
      title: "Subscription Manager",
      description: "Subscription Manager",
      url: "https://www.subscription-manager.app",
      siteName: "Subscription Manager",
      images: [
        {
          url: "/open-graph-image.png",
        },
      ],
    },
    metadataBase: new URL("https://www.subscription-manager.app"),
    alternates: {
      canonical: "/",
      languages: {
        "x-default": "/",
      },
    },
  };
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${GeistSans.variable} dark`}
      suppressHydrationWarning
    >
      <body>
        <TRPCReactProvider>
          <Providers>
            <Navigation session={session} />
            {children}
            <PageFooter />
            {!session && (
              <>
                <SignupForm />
                <LoginForm />
              </>
            )}
            <Toaster />
          </Providers>
        </TRPCReactProvider>
        <Analytics />
      </body>
    </html>
  );
}
