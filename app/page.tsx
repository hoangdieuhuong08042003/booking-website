import { FeaturedDestinations } from "./_components/featured-destinations";
import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import { HeroSection } from "./_components/hero-section";
import { Services } from "./_components/services";
import { SectionReveal } from "./_components/section-reveal";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <SectionReveal>
        <section id="hero">
          <HeroSection />
        </section>
      </SectionReveal>
      <SectionReveal>
        <section id="featured-destinations">
          <FeaturedDestinations />
        </section>
      </SectionReveal>
      <SectionReveal>
        <section id="services">
          <Services />
        </section>
      </SectionReveal>

      <Footer />
    </main>
  );
}
