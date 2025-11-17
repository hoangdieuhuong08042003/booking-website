import { FeaturedDestinations } from "./_components/featured-destinations";
import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import { HeroSection } from "./_components/hero-section";
import { Services } from "./_components/services";
import { Testimonials } from "./_components/testimonials";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturedDestinations />
      <Services />
      <Testimonials />
      <Footer />
    </main>
  );
}
