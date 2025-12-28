"use client";
import { FeaturedDestinations } from "./_components/featured-destinations";
import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import { HeroSection } from "./_components/hero-section";
import { Services } from "./_components/services";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

function SectionReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <SectionReveal>
        <HeroSection />
      </SectionReveal>
      <SectionReveal>
        <FeaturedDestinations />
      </SectionReveal>
      <SectionReveal>
        <Services />
      </SectionReveal>

      <Footer />
    </main>
  );
}
