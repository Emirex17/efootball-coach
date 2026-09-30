export type PositionSlot = {
    id: string;
    role: string;
    label: string;
    positionId: number; // 0: GK, 1: CB, 2: LB, 3: RB, 4: DMF, 5: CMF, 6: LMF, 7: RMF, 8: AMF, 9: LWF, 10: RWF, 11: SS, 12: CF
    x: number; // Percentage 0 - 100
    y: number; // Percentage 0 - 100 (GK at bottom ~88, CF at top ~14)
};

export type FormationDefinition = {
    name: string;
    displayName: string;
    description: string;
    bestForPlaystyles: string[];
    slots: PositionSlot[];
};

export const POSITION_NAMES: Record<number, string> = {
    0: "GK",
    1: "CB",
    2: "LB",
    3: "RB",
    4: "DMF",
    5: "CMF",
    6: "LMF",
    7: "RMF",
    8: "AMF",
    9: "LWF",
    10: "RWF",
    11: "SS",
    12: "CF",
};

export const POSITION_CATEGORIES: Record<string, "GK" | "DEF" | "MID" | "FWD"> = {
    GK: "GK",
    CB: "DEF",
    LB: "DEF",
    RB: "DEF",
    DMF: "MID",
    CMF: "MID",
    LMF: "MID",
    RMF: "MID",
    AMF: "MID",
    LWF: "FWD",
    RWF: "FWD",
    SS: "FWD",
    CF: "FWD",
};

export const FORMATIONS: Record<string, FormationDefinition> = {
    "4-2-1-3": {
        name: "4-2-1-3",
        displayName: "4-2-1-3 Meta Attack",
        description: "Deadly on counter-attacks with 3 forwards and an AMF playmaker.",
        bestForPlaystyles: ["Quick Counter", "Long Ball Counter"],
        slots: [
            { id: "gk", role: "GK", label: "GK", positionId: 0, x: 50, y: 90 },
            { id: "lb", role: "LB", label: "LB", positionId: 2, x: 15, y: 74 },
            { id: "lcb", role: "CB", label: "CB", positionId: 1, x: 38, y: 77 },
            { id: "rcb", role: "CB", label: "CB", positionId: 1, x: 62, y: 77 },
            { id: "rb", role: "RB", label: "RB", positionId: 3, x: 85, y: 74 },
            { id: "ldmf", role: "DMF", label: "DMF", positionId: 4, x: 37, y: 58 },
            { id: "rcmf", role: "CMF", label: "CMF", positionId: 5, x: 63, y: 55 },
            { id: "amf", role: "AMF", label: "AMF", positionId: 8, x: 50, y: 40 },
            { id: "lwf", role: "LWF", label: "LWF", positionId: 9, x: 18, y: 22 },
            { id: "cf", role: "CF", label: "CF", positionId: 12, x: 50, y: 15 },
            { id: "rwf", role: "RWF", label: "RWF", positionId: 10, x: 82, y: 22 },
        ],
    },
    "4-3-3": {
        name: "4-3-3",
        displayName: "4-3-3 Classic Possession",
        description: "Balanced midfield triangle for tiki-taka passing and wing overloads.",
        bestForPlaystyles: ["Possession", "Outwide"],
        slots: [
            { id: "gk", role: "GK", label: "GK", positionId: 0, x: 50, y: 90 },
            { id: "lb", role: "LB", label: "LB", positionId: 2, x: 15, y: 74 },
            { id: "lcb", role: "CB", label: "CB", positionId: 1, x: 38, y: 77 },
            { id: "rcb", role: "CB", label: "CB", positionId: 1, x: 62, y: 77 },
            { id: "rb", role: "RB", label: "RB", positionId: 3, x: 85, y: 74 },
            { id: "dmf", role: "DMF", label: "DMF", positionId: 4, x: 50, y: 60 },
            { id: "lcmf", role: "CMF", label: "CMF", positionId: 5, x: 32, y: 46 },
            { id: "rcmf", role: "CMF", label: "CMF", positionId: 5, x: 68, y: 46 },
            { id: "lwf", role: "LWF", label: "LWF", positionId: 9, x: 18, y: 22 },
            { id: "cf", role: "CF", label: "CF", positionId: 12, x: 50, y: 15 },
            { id: "rwf", role: "RWF", label: "RWF", positionId: 10, x: 82, y: 22 },
        ],
    },
    "4-1-2-3": {
        name: "4-1-2-3",
        displayName: "4-1-2-3 High Press",
        description: "Aggressive ultra-offensive formation with twin AMFs behind front 3.",
        bestForPlaystyles: ["Quick Counter", "Overload"],
        slots: [
            { id: "gk", role: "GK", label: "GK", positionId: 0, x: 50, y: 90 },
            { id: "lb", role: "LB", label: "LB", positionId: 2, x: 15, y: 74 },
            { id: "lcb", role: "CB", label: "CB", positionId: 1, x: 38, y: 77 },
            { id: "rcb", role: "CB", label: "CB", positionId: 1, x: 62, y: 77 },
            { id: "rb", role: "RB", label: "RB", positionId: 3, x: 85, y: 74 },
            { id: "dmf", role: "DMF", label: "DMF", positionId: 4, x: 50, y: 62 },
            { id: "lamf", role: "AMF", label: "AMF", positionId: 8, x: 34, y: 42 },
            { id: "ramf", role: "AMF", label: "AMF", positionId: 8, x: 66, y: 42 },
            { id: "lwf", role: "LWF", label: "LWF", positionId: 9, x: 18, y: 22 },
            { id: "cf", role: "CF", label: "CF", positionId: 12, x: 50, y: 15 },
            { id: "rwf", role: "RWF", label: "RWF", positionId: 10, x: 82, y: 22 },
        ],
    },
    "4-2-2-2": {
        name: "4-2-2-2",
        displayName: "4-2-2-2 Twin Strikers",
        description: "Solid double pivot protection with dual strikers and attacking midfielders.",
        bestForPlaystyles: ["Long Ball Counter", "Quick Counter"],
        slots: [
            { id: "gk", role: "GK", label: "GK", positionId: 0, x: 50, y: 90 },
            { id: "lb", role: "LB", label: "LB", positionId: 2, x: 15, y: 74 },
            { id: "lcb", role: "CB", label: "CB", positionId: 1, x: 38, y: 77 },
            { id: "rcb", role: "CB", label: "CB", positionId: 1, x: 62, y: 77 },
            { id: "rb", role: "RB", label: "RB", positionId: 3, x: 85, y: 74 },
            { id: "ldmf", role: "DMF", label: "DMF", positionId: 4, x: 36, y: 60 },
            { id: "rdmf", role: "DMF", label: "DMF", positionId: 4, x: 64, y: 60 },
            { id: "lamf", role: "AMF", label: "AMF", positionId: 8, x: 26, y: 38 },
            { id: "ramf", role: "AMF", label: "AMF", positionId: 8, x: 74, y: 38 },
            { id: "lcf", role: "CF", label: "CF", positionId: 12, x: 38, y: 17 },
            { id: "rcf", role: "CF", label: "CF", positionId: 12, x: 62, y: 17 },
        ],
    },
    "4-2-3-1": {
        name: "4-2-3-1",
        displayName: "4-2-3-1 Wide Play",
        description: "Structured formation with wide wingers for crosses and cut-backs.",
        bestForPlaystyles: ["Outwide", "Possession"],
        slots: [
            { id: "gk", role: "GK", label: "GK", positionId: 0, x: 50, y: 90 },
            { id: "lb", role: "LB", label: "LB", positionId: 2, x: 15, y: 74 },
            { id: "lcb", role: "CB", label: "CB", positionId: 1, x: 38, y: 77 },
            { id: "rcb", role: "CB", label: "CB", positionId: 1, x: 62, y: 77 },
            { id: "rb", role: "RB", label: "RB", positionId: 3, x: 85, y: 74 },
            { id: "ldmf", role: "DMF", label: "DMF", positionId: 4, x: 36, y: 60 },
            { id: "rdmf", role: "CMF", label: "CMF", positionId: 5, x: 64, y: 60 },
            { id: "lmf", role: "LMF", label: "LMF", positionId: 6, x: 18, y: 38 },
            { id: "amf", role: "AMF", label: "AMF", positionId: 8, x: 50, y: 36 },
            { id: "rmf", role: "RMF", label: "RMF", positionId: 7, x: 82, y: 38 },
            { id: "cf", role: "CF", label: "CF", positionId: 12, x: 50, y: 16 },
        ],
    },
    "3-2-4-1": {
        name: "3-2-4-1",
        displayName: "3-2-4-1 Overload Box",
        description: "Creates overwhelming numerical supremacy in central zones.",
        bestForPlaystyles: ["Overload", "Possession"],
        slots: [
            { id: "gk", role: "GK", label: "GK", positionId: 0, x: 50, y: 90 },
            { id: "lcb", role: "CB", label: "CB", positionId: 1, x: 26, y: 77 },
            { id: "ccb", role: "CB", label: "CB", positionId: 1, x: 50, y: 79 },
            { id: "rcb", role: "CB", label: "CB", positionId: 1, x: 74, y: 77 },
            { id: "ldmf", role: "DMF", label: "DMF", positionId: 4, x: 38, y: 62 },
            { id: "rdmf", role: "DMF", label: "DMF", positionId: 4, x: 62, y: 62 },
            { id: "lmf", role: "LMF", label: "LMF", positionId: 6, x: 15, y: 40 },
            { id: "lamf", role: "AMF", label: "AMF", positionId: 8, x: 38, y: 36 },
            { id: "ramf", role: "AMF", label: "AMF", positionId: 8, x: 62, y: 36 },
            { id: "rmf", role: "RMF", label: "RMF", positionId: 7, x: 85, y: 40 },
            { id: "cf", role: "CF", label: "CF", positionId: 12, x: 50, y: 16 },
        ],
    },
    "4-4-2": {
        name: "4-4-2",
        displayName: "4-4-2 Direct Long Ball",
        description: "Traditional dual-striker system optimal for second-ball recoveries.",
        bestForPlaystyles: ["Long Ball"],
        slots: [
            { id: "gk", role: "GK", label: "GK", positionId: 0, x: 50, y: 90 },
            { id: "lb", role: "LB", label: "LB", positionId: 2, x: 15, y: 74 },
            { id: "lcb", role: "CB", label: "CB", positionId: 1, x: 38, y: 77 },
            { id: "rcb", role: "CB", label: "CB", positionId: 1, x: 62, y: 77 },
            { id: "rb", role: "RB", label: "RB", positionId: 3, x: 85, y: 74 },
            { id: "lmf", role: "LMF", label: "LMF", positionId: 6, x: 16, y: 48 },
            { id: "lcmf", role: "CMF", label: "CMF", positionId: 5, x: 38, y: 52 },
            { id: "rcmf", role: "CMF", label: "CMF", positionId: 5, x: 62, y: 52 },
            { id: "rmf", role: "RMF", label: "RMF", positionId: 7, x: 84, y: 48 },
            { id: "lcf", role: "CF", label: "CF", positionId: 12, x: 38, y: 18 },
            { id: "rcf", role: "CF", label: "CF", positionId: 12, x: 62, y: 18 },
        ],
    },
    "5-2-1-2": {
        name: "5-2-1-2",
        displayName: "5-2-1-2 Defensive Wall",
        description: "Impentrable 5-back structure with counter-attacking punch.",
        bestForPlaystyles: ["Defensive", "Long Ball Counter"],
        slots: [
            { id: "gk", role: "GK", label: "GK", positionId: 0, x: 50, y: 90 },
            { id: "lwb", role: "LB", label: "LWB", positionId: 2, x: 12, y: 68 },
            { id: "lcb", role: "CB", label: "CB", positionId: 1, x: 30, y: 78 },
            { id: "ccb", role: "CB", label: "CB", positionId: 1, x: 50, y: 80 },
            { id: "rcb", role: "CB", label: "CB", positionId: 1, x: 70, y: 78 },
            { id: "rwb", role: "RB", label: "RWB", positionId: 3, x: 88, y: 68 },
            { id: "ldmf", role: "DMF", label: "DMF", positionId: 4, x: 38, y: 56 },
            { id: "rcmf", role: "CMF", label: "CMF", positionId: 5, x: 62, y: 56 },
            { id: "amf", role: "AMF", label: "AMF", positionId: 8, x: 50, y: 38 },
            { id: "lcf", role: "CF", label: "CF", positionId: 12, x: 38, y: 17 },
            { id: "rcf", role: "CF", label: "CF", positionId: 12, x: 62, y: 17 },
        ],
    },
};

export function getDefaultFormationForPlaystyle(playstyle?: string | null): string {
    if (!playstyle) return "4-2-1-3";
    const lower = playstyle.toLowerCase();
    if (lower.includes("possession")) return "4-3-3";
    if (lower.includes("quick counter")) return "4-2-1-3";
    if (lower.includes("long ball counter")) return "4-2-2-2";
    if (lower.includes("long ball")) return "4-4-2";
    if (lower.includes("overload")) return "3-2-4-1";
    if (lower.includes("outwide") || lower.includes("wide")) return "4-2-3-1";
    return "4-2-1-3";
}

export type Formation = FormationDefinition;
export const formation433 = FORMATIONS["4-3-3"];
export const formation4213 = FORMATIONS["4-2-1-3"];
export const formation4123 = FORMATIONS["4-1-2-3"];
export const formation4222 = FORMATIONS["4-2-2-2"];
export const formation4231 = FORMATIONS["4-2-3-1"];
export const formation3241 = FORMATIONS["3-2-4-1"];
export const formation442 = FORMATIONS["4-4-2"];
export const formation5212 = FORMATIONS["5-2-1-2"];