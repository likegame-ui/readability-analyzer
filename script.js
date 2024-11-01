function analyzeText() {
    const text = document.getElementById('textInput').value;
    const words = text.split(/\s+/).filter(Boolean).length;
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;
    const syllables = countSyllables(text);
    
    const fleschScore = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
    document.getElementById('result').innerText = `Flesch Reading Ease Score: ${fleschScore.toFixed(2)}`;
}

function countSyllables(text) {
    const words = text.split(/\s+/);
    let syllableCount = 0;
    
    for (let word of words) {
        syllableCount += countWordSyllables(word);
    }
    return syllableCount;
}

function countWordSyllables(word) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1; // Simple rule: words with 3 letters or fewer have 1 syllable.
    const syllableMatches = word.match(/[aeiouy]+/g); // Count vowel groups as syllables.
    return syllableMatches ? syllableMatches.length : 1; // Default to 1 syllable if no matches.
}
