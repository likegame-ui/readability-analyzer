function compareTexts() {
    const text1 = document.getElementById('textInput1').value;
    const text2 = document.getElementById('textInput2').value;

    const metrics1 = analyzeText(text1);
    const metrics2 = analyzeText(text2);

    const similarity = calculateSimilarity(metrics1, metrics2);

    document.getElementById('result').innerText = `Comparison Results:\n\n` +
        `Text 1: ${metrics1.readabilityScore.toFixed(2)}\n` +
        `Text 2: ${metrics2.readabilityScore.toFixed(2)}\n\n` +
        `Similarity Score: ${similarity.toFixed(2)}%`;
}

function analyzeText(text) {
    const words = text.split(/\s+/).filter(Boolean).length;
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;
    const syllables = countSyllables(text);
    
    const readabilityScore = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));

    return {
        readabilityScore: readabilityScore,
        wordCount: words,
        sentenceCount: sentences,
        syllableCount: syllables
    };
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
    if (word.length <= 3) return 1; // Simple rule for syllable counting.
    const syllableMatches = word.match(/[aeiouy]+/g); // Count vowel groups as syllables.
    return syllableMatches ? syllableMatches.length : 1; // Default to 1 syllable if no matches.
}

function calculateSimilarity(metrics1, metrics2) {
    const readabilityDifference = Math.abs(metrics1.readabilityScore - metrics2.readabilityScore);
    
    // Similarity can be defined based on the difference in readability scores.
    // Normalize the difference to a percentage (0 to 100%)
    const maxScore = 100; // Arbitrary max for comparison, adjust if necessary
    const similarity = ((maxScore - readabilityDifference) / maxScore) * 100;
    
    return similarity > 100 ? 100 : similarity; // Cap similarity at 100%
}
