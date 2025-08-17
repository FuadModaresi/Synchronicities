import { ReactNode } from "react";
import "./globals.css";

// The root layout is a client component because it uses client-side
// features like the theme provider.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
