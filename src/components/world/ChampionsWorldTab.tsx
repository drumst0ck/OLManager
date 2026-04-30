import { useState } from "react";
import ChampionsGrid from "../champions/ChampionsGrid";
import ChampionProfile, { type Champion } from "../champions/ChampionProfile";

export default function ChampionsWorldTab() {
  const [selectedChampion, setSelectedChampion] = useState<Champion | null>(
    null,
  );

  function handleChampionClick(champion: Champion) {
    setSelectedChampion(champion);
  }

  function handleCloseProfile() {
    setSelectedChampion(null);
  }

  return (
    <div className="space-y-6">
      {/* Champions Grid */}
      <section className="rounded-2xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-800 p-4">
        <ChampionsGrid onChampionClick={handleChampionClick} />
      </section>

      {/* Champion Profile Modal */}
      {selectedChampion && (
        <ChampionProfile
          champion={selectedChampion}
          onClose={handleCloseProfile}
        />
      )}
    </div>
  );
}