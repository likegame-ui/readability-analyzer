function analyzeText() {
    const text = document.getElementById('textInput').value;
    const styles = compareStyles(text);
    
    const readabilityScore = calculateFleschScore(text);
    const result = `Flesch Reading Ease Score: ${readabilityScore.toFixed(2)}\n\nStyle Comparison:\n` +
                   `Shakespeare: ${styles.shakespeare}\n` +
                   `Wikipedia: ${styles.wikipedia}\n` +
                   `1st Grade Author: ${styles.grade1}`;
    
    document.getElementById('result').innerText = result;
}

function calculateFleschScore(text) {
    const words = text.split(/\s+/).filter(Boolean).length;
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;
    const syllables = countSyllables(text);
    
    return 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
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

function compareStyles(text) {
    const words = text.split(/\s+/).filter(Boolean).length;
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;
    
    // Style comparison metrics
    const shakespeareScore = shakespeareMetric(text);
    const wikipediaScore = wikipediaMetric(text);
    const grade1Score = grade1Metric(text);

    return {
        shakespeare: shakespeareScore,
        wikipedia: wikipediaScore,
        grade1: grade1Score
    };
}

function shakespeareMetric(text) {
    const richVocabularyCount = (text.match(/\b\w{6,}\b/g) || []).length; // Count words with 6 or more letters
    return richVocabularyCount > 10 ? 'Good' : 'Needs more complex vocabulary';
}

function wikipediaMetric(text) {
    const averageSentenceLength = text.split(/[.!?]+/).filter(Boolean).map(s => s.split(' ').length).reduce((a, b) => a + b, 0) / (text.split(/[.!?]+/).filter(Boolean).length || 1);
    return averageSentenceLength < 15 ? 'Good' : 'Too complex for Wikipedia style';
}

function grade1Metric(text) {
    const shortSentenceCount = text.split(/[.!?]+/).filter(Boolean).filter(s => s.split(' ').length <= 5).length;
    return shortSentenceCount > 5 ? 'Good' : 'Needs simpler sentences';
}
