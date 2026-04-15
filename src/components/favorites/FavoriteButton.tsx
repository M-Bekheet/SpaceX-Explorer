"use client";

import { Heart } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  launchId: string;
  className?: string;
}

export function FavoriteButton({ launchId, className }: FavoriteButtonProps) {
  const [favorites, setFavorites] = useLocalStorage<string[]>(
    "spacex-favorites",
    []
  );

  const isFavorite = favorites.includes(launchId);

  function toggleFavorite() {
    setFavorites((prev) =>
      prev.includes(launchId)
        ? prev.filter((id) => id !== launchId)
        : [...prev, launchId]
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleFavorite}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      className={cn(className)}
    >
      <Heart
        className={cn(
          "size-4 transition-colors",
          isFavorite
            ? "fill-red-500 text-red-500"
            : "text-muted-foreground"
        )}
      />
    </Button>
  );
}
