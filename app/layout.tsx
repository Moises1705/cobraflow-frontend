import type { Metadata } from "next";
import "./globals.css";
import NavbarWrapper from "../components/NavbarWrapper";

export const metadata: Metadata = {
  title: "CobraFlow",
  description: "CRM Financiero para gestoras de cobranza",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <NavbarWrapper />
        {children}
      </body>
    </html>
  );
}