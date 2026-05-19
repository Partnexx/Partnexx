"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

type Variant = "landing" | "marques" | "createurs" | "auto";

interface NavbarProps {
  variant?: Variant;
}

export default function Navbar({ variant = "auto" }: NavbarProps) {
  const pathname = usePathname();

  const resolved: Variant =
    variant !== "auto"
      ? variant
      : pathname.startsWith("/createurs")
      ? "createurs"
      : pathname.startsWith("/marques")
      ? "marques"
      : "landing";

  const linkBase =
    "text-sm text-muted-foreground hover:text-foreground transition-colors";

  return (
    <nav className="relative z-20 container flex items-center justify-between py-4">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="Partnexx"
          width={36}
          height={36}
          className="w-9 h-9 object-contain"
        />
        <span className="text-lg font-semibold tracking-tight text-foreground">
          Partnexx
        </span>
      </Link>

      {resolved === "landing" && (
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white/70 backdrop-blur px-4 py-2 text-sm font-semibold text-foreground hover:bg-white hover:border-foreground/20 hover:shadow-soft transition-all"
        >
          Connexion
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}

      {resolved === "marques" && (
        <>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/marques#how" className={linkBase}>Comment ça marche</Link>
            <Link href="/marques/avantages" className={linkBase}>Avantages</Link>
            <Link href="/pricing" className={linkBase}>Pricing</Link>
            <Link href="/marques/a-propos" className={linkBase}>À propos</Link>
            <Link href="/marques/contact" className={linkBase}>Contact</Link>
          </div>
          <Link
            href="/marques/inscription"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-soft hover:scale-[1.03] transition-transform"
          >
            Lancer une campagne
            <ArrowRight className="w-4 h-4" />
          </Link>
        </>
      )}

      {resolved === "createurs" && (
        <>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/createurs" className={linkBase}>Comment ça marche</Link>
            <Link href="/createurs/avantages" className={linkBase}>Avantages</Link>
            <Link href="/createurs/a-propos" className={linkBase}>À propos</Link>
            <Link href="/createurs/contact" className={linkBase}>Contact</Link>
          </div>
          <Link
            href="/createurs/inscription"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-soft hover:scale-[1.03] transition-transform"
          >
            Rejoindre gratuitement
            <ArrowRight className="w-4 h-4" />
          </Link>
        </>
      )}
    </nav>
  );
}