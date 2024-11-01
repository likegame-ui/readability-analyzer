const preSampleText = `To be, or not to be, that is the question: 
Whether 'tis nobler in the mind to suffer 
The slings and arrows of outrageous fortune, 
Or to take arms against a sea of troubles 
And by opposing end them.`;

document.getElementById('compareButton').onclick = compareText;

function compareText() {
    const enteredText = document.getElementById('textInput').value;

    // Extract features from the pre-sample and entered text
    const preSampleFeatures = extractFeatures(preSampleText);
    const enteredTextFeatures = extractFeatures(enteredText);

    // Calculate similarity score
    const similarityScore = analyzeSimilarity(preSampleFeatures, enteredTextFeatures);

    // Display result
    document.getElementById('result').innerText = `Style Similarity Score: ${similarityScore.toFixed(2)}%`;
}

function extractFeatures(text) {
    const words = text.split(/\s+/).filter(Boolean);
    const uniqueWords = new Set(words);
    const sentences = text.split(/[.!?]+/).filter(Boolean);

    return {
        averageSentenceLength: words.length / sentences.length || 0,
        lexicalDiversity: uniqueWords.size / words.length || 0,
        wordFrequency: calculateWordFrequency(words)
    };
}

function calculateWordFrequency(words) {
    const frequency = {};
    words.forEach(word => {
        frequency[word.toLowerCase()] = (frequency[word.toLowerCase()] || 0) + 1;
    });
    return frequency;
}

function analyzeSimilarity(preSampleFeatures, enteredTextFeatures) {
    const lengthSimilarity = 100 - Math.abs(preSampleFeatures.averageSentenceLength - enteredTextFeatures.averageSentenceLength) * 10; // Scale to 0-100
    const diversitySimilarity = 100 - Math.abs(preSampleFeatures.lexicalDiversity - enteredTextFeatures.lexicalDiversity) * 100; // Scale to 0-100

    // Common word frequency similarity
    const commonWordSimilarity = calculateCommonWordSimilarity(preSampleFeatures.wordFrequency, enteredTextFeatures.wordFrequency);

    // Final similarity score as an average of the three measures
    return (lengthSimilarity + diversitySimilarity + commonWordSimilarity) / 3;
}

function calculateCommonWordSimilarity(referenceFreq, enteredFreq) {
    const commonWords = Object.keys(referenceFreq).filter(word => enteredFreq[word] !== undefined);
    const totalWords = Object.keys(referenceFreq).length + Object.keys(enteredFreq).length - commonWords.length;

    if (totalWords === 0) return 0; // Avoid division by zero
    return (commonWords.length / totalWords) * 100; // Percentage of commonality
}
