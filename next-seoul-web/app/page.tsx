import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import HistorySection from "./components/HistorySection";
import CategoryGrid from "./components/CategoryGrid";
import StatisticsSection from "./components/StatisticsSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <HeroSection />
      <HistorySection />
      <CategoryGrid />
      <StatisticsSection />
    </div>
  );
}
