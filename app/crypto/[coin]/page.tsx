import { notFound } from "next/navigation";
import Link from "next/link";
import { getAsset } from "@/lib/crypto";
import { CoinDetail } from "@/components/crypto/coin-detail";
// Resolve current API IDs at request time, including assets outside the demo list.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ coin: string }>;
}) {
  const asset = await getAsset((await params).coin);
  return { title: asset ? `${asset.name} Analytics` : "Asset not found" };
}
export default async function CoinPage({
  params,
}: {
  params: Promise<{ coin: string }>;
}) {
  const asset = await getAsset((await params).coin);
  if (!asset) notFound();
  return (
    <>
      <Link href="/crypto" className="muted text-xs">
        ← Back to Crypto Market
      </Link>
      <CoinDetail key={asset.id} asset={asset} />
    </>
  );
}
