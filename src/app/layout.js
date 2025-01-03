import { Geist, Geist_Mono } from "next/font/google";
import { Roboto } from "next/font/google";

import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "WorkFlow",
  description: "Your Project, Perfectly Managed.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={` ${geistMono.variable} antialiased`}>
        <GoogleOAuthProvider clientId={process.env.CLIENT_ID}>
          <div className={`${roboto.className}`}>{children}</div>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
