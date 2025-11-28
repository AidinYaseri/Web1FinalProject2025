"use strict";
import { sortCharacters } from "../utils/character-sorters.js";

const BASE_URL = "https://thesimpsonsapi.com/api/characters";

// Calculate stats based on age
function calculateStats(ageRaw) {
    const age = Number(ageRaw) || 40;
    return {
        resilience: Math.max(10, 100 - age),
        exhaustion: Math.min(90, age / 2),
        defense: Math.max(5, age),
    };
}

// Convert API character → Player object
function convertToPlayer(character) {
    const stats = calculateStats(character.age);
    return {
        playerId: character.name,
        totalScore: 0,
        totalHealth: 100,
        imagesrc: `https://cdn.thesimpsonsapi.com/500${character.portrait_path}`,
        stats: {
            resilience: Math.round(stats.resilience),
            exhaustion: Math.round(stats.exhaustion),
            defense: Math.round(stats.defense),
        },
    };
}

async function fetchCharacters() {
    const response = await fetch(`${BASE_URL}`);
    const data = await response.json();
    return data.results.slice(0, 20);
}

export const SIMPSONS_CHARACTERS = await (async () => {
    try {
        const characters = await fetchCharacters();
        return sortCharacters(characters.map(convertToPlayer));
    } catch (err) {
        console.error("Error fetching characters:", err);
        return [];
    }
})();
