import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import About from "@/components/sections/About";

export default function MarquesAProposPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <section className="relative">
        <div className="glow-orb w-[520px] h-[520px] -top-40 -left-32" style={{ background: "#00B8E6" }} aria-hidden />
        <div className="glow-orb w-[560px] h-[560px] top-1/4 -right-40" style={{ background: "#FF4FD8" }} aria-hidden />
        <Navbar variant="marques" />
      </section>

      <About variant="brands" />

      <Footer />
    </main>
  );
}