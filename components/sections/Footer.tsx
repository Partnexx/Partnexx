import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative border-t border-border pt-28 pb-3">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Partnexx" width={28} height={28} className="w-7 h-7 object-contain" />
          <span className="font-semibold text-foreground">Partnexx</span>
          <span className="text-sm text-muted-foreground ml-2">© 2026</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link href="/mentions-legales" className="hover:text-foreground transition-colors">Mentions légales</Link>
          <Link href="/cgu" className="hover:text-foreground transition-colors">CGU</Link>
          <Link href="/politique-confidentialite" className="hover:text-foreground transition-colors">Politique de confidentialité</Link>
        </div>
      </div>
    </footer>
  );
}