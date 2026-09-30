import { GoogleGenAI } from "@google/genai";
import { efootballKnowledge } from "@/data/efootball-knowledge";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

const MAX_QUESTION_LENGTH = 2000;
const MAX_PLAYERS = 18;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limited = rateLimit(`coach:${ip}`, { limit: 15, windowMs: 60_000 });
    if (!limited.ok) {
      return Response.json(
        {
          answer: `You're asking too quickly. Please wait ${limited.retryAfterSec}s and try again.`,
        },
        {
          status: 429,
          headers: { "Retry-After": String(limited.retryAfterSec) },
        }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { answer: "API configuration error: GEMINI_API_KEY is not set." },
        { status: 500 }
      );
    }

    let body: {
      question?: unknown;
      teamPlaystyle?: unknown;
      aggression?: unknown;
      players?: unknown;
    };

    try {
      body = await request.json();
    } catch {
      return Response.json(
        { answer: "Invalid request body. Please send valid JSON." },
        { status: 400 }
      );
    }

    const question =
      typeof body.question === "string" ? body.question.trim() : "";
    if (!question) {
      return Response.json(
        { answer: "Please enter a tactical question." },
        { status: 400 }
      );
    }
    if (question.length > MAX_QUESTION_LENGTH) {
      return Response.json(
        {
          answer: `Question is too long. Keep it under ${MAX_QUESTION_LENGTH} characters.`,
        },
        { status: 400 }
      );
    }

    const teamPlaystyle =
      typeof body.teamPlaystyle === "string" && body.teamPlaystyle.trim()
        ? body.teamPlaystyle.trim().slice(0, 80)
        : "Standard";
    const aggression =
      typeof body.aggression === "string" && body.aggression.trim()
        ? body.aggression.trim().slice(0, 80)
        : "Balanced";

    const players = Array.isArray(body.players)
      ? body.players.slice(0, MAX_PLAYERS)
      : [];
    const selectedPlayers = JSON.stringify(players, null, 2);
    const knowledge = JSON.stringify(efootballKnowledge, null, 2);

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `
PLAYER PROFILE:
Team Playstyle: ${teamPlaystyle}
Aggression: ${aggression}
${knowledge}
SELECTED PLAYERS
${selectedPlayers}
IMPORTANT:
The SELECTED PLAYERS section contains the ACTUAL PLAYERS in the user's team.  
You MUST use these players in your tactical analysis.
You MUST mention the selected players by name when relevant.
Do NOT say that user did not provide player names if SELECTED PLAYERS contains player data.
Do NOT invent replacement players.
consider each player's position and rating when recommending formations, roles, attacking patterns, and defensive structures.

USER QUESTION

${question}

COACH INSTRUCTIONS:

You are an elite eFootball tactical coach with deep expertise in the latest version of eFootball. You have mastered the current tactical system which consists of:

CURRENT eFootball TACTICAL SYSTEM:

Defensive Instructions (pick one or combine):
- Defensive Anchoring: Assigns a player to stay back and protect space defensively
- Counter: Team transitions quickly to attack when ball is won
- Target Man: Directs play through a focal point striker
- Marking: Players track specific opponents
- Tight Marking: Players stay extremely close to opponents

Offensive/Defensive Shape:
- Fluid Formation: Formation shifts dynamically both in attack and defense, creating overloads and covering spaces automatically

Manager Style options affect overall team mentality and how fluid formation behaves.

YOUR ROLE AS COACH:

When a user describes their playstyle, you:
1. Recommend the best formation from this list:
4123, 4213, 4114, 4222, 4231, 4321, 4312, 433, 4132, 442, 4411, 352, 3241, 3421, 3313, 343, 361, 532, 5212, 5221, 541, 5122 and their variants

2. Recommend which defensive instructions suit their style
3. Explain whether to use Fluid Formation for offense, defense, or both
4. Recommend player roles for each position in the formation
5. Explain how to attack with the formation
6. Explain how to defend with the formation
7. Suggest which formations counter their chosen formation
8. Give in-game tips specific to eFootball mechanics

ALWAYS:
- Be specific to eFootball mechanics, not real football
- Give exact formation + instruction combinations
- Explain WHY each recommendation suits their style
- Talk like a real experienced eFootball manager
- Never give generic football advice
- Always reference the actual in-game instructions available
- Be conversational, tactical, and highly specific

Player's TeamPlaystyle: ${teamPlaystyle}
Player's Aggression: ${aggression}
Player's Question: ${question}
      `,
    });

    return Response.json({ answer: response.text });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    console.error("[api/coach]", message);
    return Response.json(
      {
        answer:
          "Tactical Coach is currently busy or unavailable. Please try asking again in a moment.",
      },
      { status: 503 }
    );
  }
}
