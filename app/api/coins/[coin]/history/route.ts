import { fetchHistory, PERIOD_DAYS } from "@/lib/history";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ coin: string }> },
) {
  const { coin } = await params;
  const days = Number(new URL(request.url).searchParams.get("days"));
  const headers = { "Cache-Control": "no-store" };
  if (
    !coin ||
    coin === "." ||
    coin === ".." ||
    !Object.values(PERIOD_DAYS).includes(days)
  ) {
    return Response.json(
      { error: "Unsupported history period or coin" },
      { status: 400, headers },
    );
  }
  try {
    return Response.json(await fetchHistory(coin, days, request.signal), {
      headers,
    });
  } catch {
    return Response.json(
      { error: "Historical data is temporarily unavailable" },
      { status: 502, headers },
    );
  }
}
