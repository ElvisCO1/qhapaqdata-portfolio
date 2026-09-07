"use client";

import { useState } from "react";
import { getCoinImage } from "@/data/coinImages";

export function CoinLogo({
  coinId,
  symbol,
}: {
  coinId: string;
  symbol: string;
}) {
  const src = getCoinImage(coinId);
  const [failedSrc, setFailedSrc] = useState<string>();

  return (
    <span className={`coin-icon ${coinId}`} aria-hidden="true">
      {src && src !== failedSrc ? (
        // Small decorative logos load directly from CoinGecko, without an image optimizer.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          width={34}
          height={34}
          className="h-full w-full rounded-full object-contain"
          loading="lazy"
          decoding="async"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        symbol.slice(0, 1).toUpperCase() || "?"
      )}
    </span>
  );
}
