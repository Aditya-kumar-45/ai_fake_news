import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "TruthLens — AI Fake News Detection",
  description: "Real-time AI-powered fake news detection and credibility analysis. Analyze news articles from multiple channels and detect misinformation using advanced NLP.",
  keywords: "fake news detection, AI, credibility analysis, fact checking, misinformation, NLP",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
