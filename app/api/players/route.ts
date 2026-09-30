import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import readline from "readline";
import { resolveNationalities } from "@/data/nationalities";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

type PlayerResult = {
  id: string;
  name: string;
  position: string;
  positions: unknown;
  rating: unknown;
  nationalities: string[];
  age: unknown;
  height: unknown;
  weight: unknown;
  strongFoot: unknown;
  strongHand: unknown;
};

const filePath = path.join(process.cwd(), "data", "PlayersDB_20260919.jsonl");

let cachedPlayers: PlayerResult[] | null = null;
let cachePromise: Promise<PlayerResult[]> | null = null;

function normalize(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

async function loadPlayers(): Promise<PlayerResult[]> {
  if (cachedPlayers) return cachedPlayers;
  if (cachePromise) return cachePromise;

  cachePromise = (async () => {
    if (!fs.existsSync(filePath)) {
      console.error("[api/players] Player database file not found:", filePath);
      return [];
    }

    const fileStream = fs.createReadStream(filePath, { encoding: "utf-8" });
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let headers: string[] = [];
    const results: PlayerResult[] = [];

    for await (const line of rl) {
      if (!line.trim()) continue;
      let row: unknown;
      try {
        row = JSON.parse(line);
      } catch {
        continue;
      }
      if (!Array.isArray(row)) continue;

      if (headers.length === 0) {
        headers = row.map(String);
        continue;
      }

      const player = Object.fromEntries(
        headers.map((header, index) => [header, row[index]])
      );

      results.push({
        id: String(player.konamiID ?? ""),
        name: String(player.playerName ?? ""),
        position: String(player.registeredPosition ?? ""),
        positions: player.positions,
        rating: player.starRating,
        nationalities: resolveNationalities(player.nationalities ?? []),
        age: player.age,
        height: player.height,
        weight: player.weight,
        strongFoot: player.strongFoot,
        strongHand: player.strongHand,
      });
    }

    cachedPlayers = results;
    return results;
  })();

  try {
    return await cachePromise;
  } finally {
    cachePromise = null;
  }
}

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const limited = rateLimit(`players:${ip}`, { limit: 60, windowMs: 60_000 });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many searches. Please wait a moment." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = normalize(searchParams.get("q")?.trim() || "");
  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }
  if (query.length > 60) {
    return NextResponse.json(
      { error: "Search query is too long." },
      { status: 400 }
    );
  }

  try {
    const players = await loadPlayers();
    const results: PlayerResult[] = [];

    for (const player of players) {
      if (!normalize(player.name).includes(query)) continue;
      results.push(player);
      if (results.length >= 20) break;
    }

    return NextResponse.json(results, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/players]", message);
    return NextResponse.json(
      { error: "Player search temporarily unavailable." },
      { status: 503 }
    );
  }
}
