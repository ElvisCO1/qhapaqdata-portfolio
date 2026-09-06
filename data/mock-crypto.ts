import type { CryptoAsset, CryptoHistoryPoint, Period } from "@/types/crypto";

export const SNAPSHOT = "2026-09-01T12:00:00.000Z";
// Illustrative names and ordering; this is not a current market ranking.
const names =
  `Bitcoin:BTC,Ethereum:ETH,Tether:USDT,BNB:BNB,Solana:SOL,USD Coin:USDC,XRP:XRP,Dogecoin:DOGE,Cardano:ADA,TRON:TRX,Avalanche:AVAX,Chainlink:LINK,Shiba Inu:SHIB,Polkadot:DOT,Bitcoin Cash:BCH,Litecoin:LTC,Uniswap:UNI,NEAR Protocol:NEAR,Polygon:POL,Internet Computer:ICP,Dai:DAI,Aptos:APT,Ethereum Classic:ETC,Stellar:XLM,Monero:XMR,Render:RENDER,Cosmos:ATOM,Filecoin:FIL,Arbitrum:ARB,Optimism:OP,Hedera:HBAR,VeChain:VET,Immutable:IMX,Injective:INJ,The Graph:GRT,Fantom:FTM,THORChain:RUNE,Maker:MKR,Algorand:ALGO,Stacks:STX,Aave:AAVE,Quant:QNT,Flow:FLOW,MultiversX:EGLD,Axie Infinity:AXS,Sandbox:SAND,Decentraland:MANA,Tezos:XTZ,EOS:EOS,Chiliz:CHZ,Neo:NEO,IOTA:IOTA,Kava:KAVA,Curve:CRV,KuCoin Token:KCS,BitTorrent:BTT,Gala:GALA,Enjin Coin:ENJ,Bitget Token:BGB,Sui:SUI,Sei:SEI,Celestia:TIA,Kaspa:KAS,Mantle:MNT,Pepe:PEPE,Bonk:BONK,Floki:FLOKI,Worldcoin:WLD,Ondo:ONDO,Jupiter:JUP,Pyth Network:PYTH,Ethena:ENA,Arweave:AR,Akash Network:AKT,Helium:HNT,Raydium:RAY,JasmyCoin:JASMY,Core:CORE,Beam:BEAM,Theta Network:THETA,Pendle:PENDLE,Conflux:CFX,Qtum:QTUM,Zcash:ZEC,Dash:DASH,Mina:MINA,Wormhole:W,Starknet:STRK,dYdX:DYDX,PancakeSwap:CAKE,Synthetix:SNX,Compound:COMP,1inch:1INCH,Basic Attention Token:BAT,Livepeer:LPT,Oasis:ROSE,Safe:SAFE,Gnosis:GNO,ENS:ENS,Terra Classic:LUNC`.split(
    ",",
  );
export const assets: CryptoAsset[] = names.map((entry, i) => {
  const [name, symbol] = entry.split(":");
  const price =
    [79619, 3248.62, 1, 583.24, 142.85, 1, 0.58, 0.124, 0.36, 0.15][i] ??
    Number((380 / (i + 1) + Math.sin(i) * 2).toFixed(3));
  return {
    id: name.toLowerCase().replaceAll(" ", "-"),
    rank: i + 1,
    name,
    symbol,
    price,
    marketCap: 1.6e12 / Math.pow(i + 1, 1.65),
    volume24h: 20.7e9 / Math.pow(i + 1, 1.1),
    change24h:
      i === 0
        ? -0.19
        : i === 2 || i === 5
          ? 0
          : Number((Math.sin(i * 3.1) * 8).toFixed(2)),
    updatedAt: SNAPSHOT,
  };
});

export function mockHistory(
  asset: CryptoAsset,
  period: Period,
): CryptoHistoryPoint[] {
  const days = { "1D": 1, "5D": 5, "1M": 30, "6M": 180, "1Y": 365 }[period];
  const count = period === "1D" ? 97 : days + 1;
  const values = Array.from(
    { length: count },
    (_, i) =>
      1 +
      (i / count) * 0.13 +
      Math.sin(i * 0.23 + asset.rank) * 0.035 +
      Math.sin(i * 0.81 + asset.rank * 2) * 0.012,
  );
  return values.map((value, i) => ({
    timestamp: new Date(
      Date.parse(SNAPSHOT) - days * 86400000 * (1 - i / (count - 1)),
    ).toISOString(),
    price: (asset.price * value) / values[count - 1],
  }));
}
