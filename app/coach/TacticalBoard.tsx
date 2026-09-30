"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    FORMATIONS,
    getDefaultFormationForPlaystyle,
    POSITION_NAMES,
    POSITION_CATEGORIES,
    type PositionSlot,
} from "@/data/formation";

export type Player = {
    id: string;
    name: string;
    position: number;
    positions: number[];
    rating: number | null;
    starRating?: number;
    nationalities?: string[];
    age?: number;
    height?: number;
    weight?: number;
    strongFoot?: number;
    strongHand?: number;
};

type TacticalBoardProps = {
    players?: Player[];
    teamPlaystyle?: string | null;
    aggression?: string | null;
    onRemovePlayer?: (playerId: string) => void;
    onSelectPlayerForQuestion?: (playerName: string) => void;
};

export default function TacticalBoard({
    players = [],
    teamPlaystyle,
    aggression,
    onRemovePlayer,
    onSelectPlayerForQuestion,
}: TacticalBoardProps) {
    const defaultFormationKey = useMemo(
        () => getDefaultFormationForPlaystyle(teamPlaystyle),
        [teamPlaystyle]
    );

    const [currentFormationKey, setCurrentFormationKey] = useState<string>(defaultFormationKey);
    const [assignedPlayers, setAssignedPlayers] = useState<Record<string, Player>>({});
    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
    const [activePlayerDetail, setActivePlayerDetail] = useState<Player | null>(null);

    // Keep formation updated if playstyle changes and user hasn't explicitly chosen one
    useEffect(() => {
        if (defaultFormationKey && !FORMATIONS[currentFormationKey]) {
            setCurrentFormationKey(defaultFormationKey);
        }
    }, [defaultFormationKey, currentFormationKey]);

    const activeFormation = FORMATIONS[currentFormationKey] || FORMATIONS["4-2-1-3"];

    // Auto-fit selected players into matching slots
    const handleAutoFit = () => {
        const newAssignments: Record<string, Player> = {};
        const available = [...players];

        // First pass: exact primary position match
        activeFormation.slots.forEach((slot) => {
            const matchIndex = available.findIndex((p) => p.position === slot.positionId);
            if (matchIndex !== -1) {
                newAssignments[slot.id] = available[matchIndex];
                available.splice(matchIndex, 1);
            }
        });

        // Second pass: alternate positions if available
        activeFormation.slots.forEach((slot) => {
            if (!newAssignments[slot.id] && available.length > 0) {
                const altMatchIndex = available.findIndex(
                    (p) => p.positions && p.positions[slot.positionId] && p.positions[slot.positionId] > 0
                );
                if (altMatchIndex !== -1) {
                    newAssignments[slot.id] = available[altMatchIndex];
                    available.splice(altMatchIndex, 1);
                }
            }
        });

        // Third pass: fill remaining empty slots with any remaining player
        activeFormation.slots.forEach((slot) => {
            if (!newAssignments[slot.id] && available.length > 0) {
                newAssignments[slot.id] = available.shift()!;
            }
        });

        setAssignedPlayers(newAssignments);
    };

    // Auto-fit on first load or when players are added if board is currently empty
    useEffect(() => {
        if (players.length > 0 && Object.keys(assignedPlayers).length === 0) {
            handleAutoFit();
        }
    }, [players]);

    // Handle clearing the board
    const handleClearBoard = () => {
        setAssignedPlayers({});
        setSelectedSlotId(null);
    };

    // Unassign a single slot
    const handleUnassignSlot = (slotId: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setAssignedPlayers((prev) => {
            const next = { ...prev };
            delete next[slotId];
            return next;
        });
        if (selectedSlotId === slotId) setSelectedSlotId(null);
    };

    // Assign a player from squad to the selected slot
    const handleAssignPlayerToSlot = (slotId: string, player: Player) => {
        setAssignedPlayers((prev) => {
            const next = { ...prev };
            // Remove player if already assigned elsewhere
            Object.keys(next).forEach((key) => {
                if (next[key].id === player.id) {
                    delete next[key];
                }
            });
            next[slotId] = player;
            return next;
        });
        setSelectedSlotId(null);
    };

    // Determine category color classes
    const getBadgeStyle = (role: string) => {
        const cat = POSITION_CATEGORIES[role] || "MID";
        switch (cat) {
            case "GK":
                return "bg-amber-500 text-black border-amber-300 shadow-amber-500/20";
            case "DEF":
                return "bg-blue-600 text-white border-blue-400 shadow-blue-500/20";
            case "MID":
                return "bg-emerald-600 text-white border-emerald-400 shadow-emerald-500/20";
            case "FWD":
                return "bg-rose-600 text-white border-rose-400 shadow-rose-500/20";
        }
    };

    const getRoleTextColor = (role: string) => {
        const cat = POSITION_CATEGORIES[role] || "MID";
        switch (cat) {
            case "GK":
                return "text-amber-400";
            case "DEF":
                return "text-blue-400";
            case "MID":
                return "text-emerald-400";
            case "FWD":
                return "text-rose-400";
        }
    };

    // Calculate unassigned players
    const assignedPlayerIds = new Set(Object.values(assignedPlayers).map((p) => p.id));
    const benchPlayers = players.filter((p) => !assignedPlayerIds.has(p.id));

    return (
        <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 text-white shadow-2xl">
            {/* Header: Formation Controls & Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                            Tactical Board
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                                eFootball 2026
                            </span>
                        </h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                        {activeFormation.displayName} · {activeFormation.description}
                    </p>
                </div>

                {/* Formation selector */}
                <div className="flex items-center gap-2 flex-wrap">
                    <label className="text-xs text-slate-400 font-medium">Formation:</label>
                    <select
                        value={currentFormationKey}
                        onChange={(e) => {
                            setCurrentFormationKey(e.target.value);
                            setSelectedSlotId(null);
                        }}
                        className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer font-mono"
                    >
                        {Object.keys(FORMATIONS).map((key) => (
                            <option key={key} value={key}>
                                {key} ({FORMATIONS[key].displayName.split(" ")[1] || "Preset"})
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={handleAutoFit}
                        disabled={players.length === 0}
                        title="Auto-place selected squad players into optimal pitch positions"
                        className="text-xs px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-md shadow-emerald-950"
                    >
                        ⚡ Auto-Fit
                    </button>

                    <button
                        type="button"
                        onClick={handleClearBoard}
                        title="Clear all players from pitch"
                        className="text-xs px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer border border-slate-700"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Tactical Pitch Container */}
            <div className="mt-5 relative w-full flex justify-center">
                <div
                    className="relative w-full max-w-[500px] aspect-[3/4] rounded-xl overflow-hidden shadow-inner border-2 border-emerald-700/60 select-none"
                    style={{
                        background: `
                            repeating-linear-gradient(
                                0deg,
                                #0f5132 0px,
                                #0f5132 40px,
                                #146c43 40px,
                                #146c43 80px
                            )
                        `,
                    }}
                >
                    {/* Pitch Turf Texture & Lighting Overlay */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-30"
                        style={{
                            background:
                                "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.4) 100%)",
                        }}
                    />

                    {/* SVG Football Pitch Markings */}
                    <svg
                        className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
                        viewBox="0 0 100 133"
                        preserveAspectRatio="none"
                        stroke="rgba(255, 255, 255, 0.65)"
                        strokeWidth="0.8"
                        fill="none"
                    >
                        {/* Outer pitch boundary line */}
                        <rect x="4" y="4" width="92" height="125" rx="1" />

                        {/* Halfway line */}
                        <line x1="4" y1="66.5" x2="96" y2="66.5" strokeDasharray="1 0" />

                        {/* Center circle & spot */}
                        <circle cx="50" cy="66.5" r="13" />
                        <circle cx="50" cy="66.5" r="0.8" fill="rgba(255,255,255,0.8)" />

                        {/* Top Penalty Area (Opponent Box) */}
                        <rect x="22" y="4" width="56" height="20" />
                        {/* Top 6-yard box */}
                        <rect x="34" y="4" width="32" height="7" />
                        {/* Top Penalty Spot & Arc */}
                        <circle cx="50" cy="16" r="0.8" fill="rgba(255,255,255,0.8)" />
                        <path d="M 39 24 A 11 11 0 0 0 61 24" />

                        {/* Bottom Penalty Area (Our Goal Box) */}
                        <rect x="22" y="109" width="56" height="20" />
                        {/* Bottom 6-yard box */}
                        <rect x="34" y="122" width="32" height="7" />
                        {/* Bottom Penalty Spot & Arc */}
                        <circle cx="50" cy="117" r="0.8" fill="rgba(255,255,255,0.8)" />
                        <path d="M 39 109 A 11 11 0 0 1 61 109" />

                        {/* Corner Arcs */}
                        <path d="M 4 8 A 4 4 0 0 0 8 4" />
                        <path d="M 92 4 A 4 4 0 0 0 96 8" />
                        <path d="M 4 125 A 4 4 0 0 1 8 129" />
                        <path d="M 96 125 A 4 4 0 0 0 92 129" />
                    </svg>

                    {/* Attacking Direction Marker */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-[10px] font-semibold text-emerald-200 tracking-wider">
                        <span>ATTACK</span>
                        <svg className="w-3 h-3 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    {/* Formation Slots */}
                    {activeFormation.slots.map((slot) => {
                        const player = assignedPlayers[slot.id];
                        const isSelectedSlot = selectedSlotId === slot.id;
                        const roleColor = getRoleTextColor(slot.role);

                        return (
                            <div
                                key={slot.id}
                                style={{
                                    left: `${slot.x}%`,
                                    top: `${slot.y}%`,
                                }}
                                className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                            >
                                {player ? (
                                    /* Occupied Player Token */
                                    <div
                                        onClick={() => setActivePlayerDetail(player)}
                                        className={`group relative flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-110 ${isSelectedSlot ? "scale-110 ring-2 ring-yellow-400" : ""
                                            }`}
                                    >
                                        {/* Player Card Badge */}
                                        <div
                                            className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex flex-col items-center justify-center font-bold border-2 shadow-lg ${getBadgeStyle(
                                                slot.role
                                            )}`}
                                        >
                                            <span className="text-[10px] sm:text-xs leading-none">{slot.role}</span>
                                            {player.rating && (
                                                <span className="text-[9px] font-mono leading-none mt-0.5 opacity-90">
                                                    {player.rating}★
                                                </span>
                                            )}
                                        </div>

                                        {/* Player Name Pill */}
                                        <div className="mt-1 px-2 py-0.5 rounded bg-slate-950/90 backdrop-blur-md border border-slate-700/80 shadow-md text-center max-w-[85px] sm:max-w-[100px] truncate">
                                            <p className="text-[10px] sm:text-xs font-semibold text-white truncate">
                                                {player.name}
                                            </p>
                                        </div>

                                        {/* Remove / Quick Unassign Icon Button on Hover */}
                                        <button
                                            type="button"
                                            onClick={(e) => handleUnassignSlot(slot.id, e)}
                                            title="Unassign from position"
                                            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    /* Empty Position Slot */
                                    <button
                                        type="button"
                                        onClick={() => setSelectedSlotId(isSelectedSlot ? null : slot.id)}
                                        className={`group flex flex-col items-center justify-center cursor-pointer transition-all ${isSelectedSlot
                                                ? "scale-110 ring-2 ring-yellow-400 rounded-full"
                                                : "hover:scale-105"
                                            }`}
                                    >
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-dashed border-white/60 bg-black/30 backdrop-blur-xs flex items-center justify-center transition-colors group-hover:border-white group-hover:bg-black/50">
                                            <span className={`text-[10px] sm:text-xs font-bold ${roleColor}`}>
                                                {slot.role}
                                            </span>
                                        </div>
                                        <span className="mt-0.5 text-[9px] text-white/70 font-mono group-hover:text-white">
                                            + Add
                                        </span>
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Quick Player Assignment Dropdown / Drawer (when an empty slot is clicked) */}
            {selectedSlotId && (
                <div className="mt-4 p-3 bg-slate-800/90 border border-slate-700 rounded-xl animate-in fade-in duration-150">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                        <span className="text-xs font-semibold text-slate-300">
                            Assign Player to{" "}
                            <span className="text-yellow-400 font-bold">
                                {activeFormation.slots.find((s) => s.id === selectedSlotId)?.role}
                            </span>
                        </span>
                        <button
                            type="button"
                            onClick={() => setSelectedSlotId(null)}
                            className="text-xs text-slate-400 hover:text-white"
                        >
                            Cancel ✕
                        </button>
                    </div>

                    {benchPlayers.length === 0 && players.length === 0 ? (
                        <p className="text-xs text-slate-400 py-3 text-center">
                            No players in your squad yet. Use the search below to search and add players!
                        </p>
                    ) : benchPlayers.length === 0 ? (
                        <p className="text-xs text-slate-400 py-3 text-center">
                            All your selected players are already on the pitch!
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto pr-1">
                            {benchPlayers.map((player) => {
                                const targetSlot = activeFormation.slots.find((s) => s.id === selectedSlotId);
                                const isBestFit = targetSlot && player.position === targetSlot.positionId;

                                return (
                                    <button
                                        key={player.id}
                                        type="button"
                                        onClick={() => handleAssignPlayerToSlot(selectedSlotId, player)}
                                        className={`flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors cursor-pointer border ${isBestFit
                                                ? "bg-emerald-950/60 border-emerald-600/70 hover:bg-emerald-900/60"
                                                : "bg-slate-900 border-slate-800 hover:bg-slate-700"
                                            }`}
                                    >
                                        <div className="truncate pr-2">
                                            <p className="font-semibold text-white truncate">{player.name}</p>
                                            <p className="text-[11px] text-slate-400">
                                                {POSITION_NAMES[player.position] || "N/A"} · {player.rating || "?"}★
                                            </p>
                                        </div>
                                        {isBestFit && (
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold shrink-0">
                                                Fit
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Bench / Reserves Bar */}
            {benchPlayers.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Available Squad Reserves ({benchPlayers.length})
                        </span>
                        <span className="text-[11px] text-slate-500">
                            Click an empty spot on pitch to place
                        </span>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                        {benchPlayers.map((player) => (
                            <div
                                key={player.id}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 shrink-0 text-xs"
                            >
                                <span className={`font-mono font-bold ${getRoleTextColor(POSITION_NAMES[player.position])}`}>
                                    {POSITION_NAMES[player.position] || "SUB"}
                                </span>
                                <span className="font-medium text-slate-200">{player.name}</span>
                                {player.rating && (
                                    <span className="text-amber-400 text-[11px]">{player.rating}★</span>
                                )}
                                {onRemovePlayer && (
                                    <button
                                        type="button"
                                        onClick={() => onRemovePlayer(player.id)}
                                        title="Remove from squad"
                                        className="text-slate-400 hover:text-rose-400 ml-1 font-bold"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tactical Advice & eFootball Setup Summary */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <p className="font-semibold text-slate-300 flex items-center gap-1.5">
                        <span>🛡️</span> In-Game Instructions
                    </p>
                    <p className="text-slate-400 mt-1 leading-relaxed">
                        Recommended: <strong className="text-emerald-400">Defensive Anchoring</strong> on DMF &{" "}
                        <strong className="text-emerald-400">Counter Target</strong> on central CF.
                    </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <p className="font-semibold text-slate-300 flex items-center gap-1.5">
                        <span>⚙️</span> Tactical Style
                    </p>
                    <p className="text-slate-400 mt-1 leading-relaxed">
                        Playstyle: <strong className="text-white">{teamPlaystyle || "Standard"}</strong> · Aggression:{" "}
                        <strong className="text-white">{aggression || "Balanced"}</strong>
                    </p>
                </div>
            </div>

            {/* Player Details Modal / Drawer */}
            {activePlayerDetail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 text-white shadow-2xl relative animate-in zoom-in-95 duration-150">
                        <button
                            type="button"
                            onClick={() => setActivePlayerDetail(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
                        >
                            ✕
                        </button>
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${getBadgeStyle(
                                    POSITION_NAMES[activePlayerDetail.position]
                                )}`}
                            >
                                {POSITION_NAMES[activePlayerDetail.position]}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white">{activePlayerDetail.name}</h3>
                                <p className="text-xs text-amber-400 font-semibold">
                                    Rating: {activePlayerDetail.rating ? `${activePlayerDetail.rating}★` : "N/A"}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2 text-xs text-slate-300 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                            {activePlayerDetail.nationalities && activePlayerDetail.nationalities.length > 0 && (
                                <p>
                                    <span className="text-slate-400">Nationality:</span>{" "}
                                    {activePlayerDetail.nationalities.join(", ")}
                                </p>
                            )}
                            {activePlayerDetail.age && (
                                <p>
                                    <span className="text-slate-400">Age:</span> {activePlayerDetail.age}
                                </p>
                            )}
                            {activePlayerDetail.height && activePlayerDetail.weight && (
                                <p>
                                    <span className="text-slate-400">Physique:</span> {activePlayerDetail.height} cm /{" "}
                                    {activePlayerDetail.weight} kg
                                </p>
                            )}
                            <p>
                                <span className="text-slate-400">Strong Foot:</span>{" "}
                                {activePlayerDetail.strongFoot === 1 ? "Left" : "Right"}
                            </p>
                        </div>

                        <div className="mt-4 flex gap-2">
                            {onSelectPlayerForQuestion && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        onSelectPlayerForQuestion(activePlayerDetail.name);
                                        setActivePlayerDetail(null);
                                    }}
                                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-semibold text-white transition-colors"
                                >
                                    Ask Coach about {activePlayerDetail.name.split(" ")[0]}
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setActivePlayerDetail(null)}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-300 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
