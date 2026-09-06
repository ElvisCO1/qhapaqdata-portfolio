import { notFound } from "next/navigation";
import Link from "next/link";
import { getAsset, getAssets } from "@/lib/crypto";
import { CoinDetail } from "@/components/crypto/coin-detail";
// The demo only serves assets from the fixed dataset.
export const dynamicParams = false;
export async function generateStaticParams() {
  return (await getAssets()).map((a) => ({ coin: a.id }));
}
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
      <CoinDetail asset={asset} />
    </>
  );
}
