import Navbar from "../components/Navbar";
import CommandPalette from "../components/CommandPalette";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import Stats from "../components/Stats";
import About from "../components/About";
import Services from "../components/Services";
import Projects from "../components/Projects";
import Process from "../components/Process";
import Skills from "../components/Skills";
import Contact from "../components/Contact";
import BigWord from "../components/BigWord";
import Footer from "../components/Footer";
import ProjectDetail from "../components/ProjectDetail";

export default function Home() {
  return (
    <>
      <Navbar />
      <CommandPalette />
      <ProjectDetail />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Marquee />
        <Stats />
        <About />
        <BigWord text="CRAFT" />
        <Services />
        <Projects />
        <BigWord text="MOTION" dir={-1} />
        <Process />
        <Skills />
        <BigWord text="LET'S BUILD" />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
