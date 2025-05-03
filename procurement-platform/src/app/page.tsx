import HomeLayout from "./components/HomeLayout";
import AnimatedHero from "./components/AnimatedHero";
import AnimatedFeatures from "./components/AnimatedFeatures";
import AnimatedHackathon from "./components/AnimatedHackathon";

export default function Home() {
  return (
    <HomeLayout>
      <div className="min-h-screen bg-white">
        {/* Animated Hero Section */}
        <AnimatedHero />

        {/* Animated Features Section */}
        <AnimatedFeatures />

        {/* Animated Hackathon Section */}
        <AnimatedHackathon />
      </div>
    </HomeLayout>
  );
}
