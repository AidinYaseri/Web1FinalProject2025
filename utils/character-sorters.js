export function sortCharacters(SIMPSONS_CHARACTERS)
{
    SIMPSONS_CHARACTERS.sort((a, b) => b.stats.defense - a.stats.defense);
    return SIMPSONS_CHARACTERS;
}