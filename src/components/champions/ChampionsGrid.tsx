import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import ChampionCard from "./ChampionCard";
import type { Champion } from "./ChampionProfile";

interface ChampionsGridProps {
  onChampionClick: (champion: Champion) => void;
}

function parseRoles(rolesJson: string): string[] {
  try {
    const parsed = JSON.parse(rolesJson);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

export default function ChampionsGrid({ onChampionClick }: ChampionsGridProps) {
  const [champions, setChampions] = useState<Champion[]>([]);

  useEffect(() => {
    let cancelled = false;

    const fetchChampions = async (): Promise<void> => {
      try {
        const result = await invoke<Champion[]>("get_champions");
        if (!cancelled) {
          setChampions(result);
        }
      } catch (err) {
        console.error("Failed to load champions:", err);
      }
    };

    void fetchChampions();

    return () => {
      cancelled = true;
    };
  }, []);

  if (champions.length === 0) {
    return <p className="text-sm text-gray-500">No champions found</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {champions.map((champion) => {
        const roles = parseRoles(champion.roles_json);
        return (
          <ChampionCard
            key={champion.id}
            id={champion.id}
            name={champion.name}
            championKey={champion.champion_key}
            roles={roles}
            imageTileUrl={champion.image_tile_url || undefined}
            onClick={() => onChampionClick(champion)}
          />
        );
      })}
    </div>
  );
}