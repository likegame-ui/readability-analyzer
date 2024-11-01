let sampleFeatures = null; // Store features of the sample text

document.getElementById("saveSampleButton").addEventListener("click", saveSampleStyle);
document.getElementById("compareButton").addEventListener("click", compareStyle);

function saveSampleStyle() {
    const preSampleText = document.getElementById("preSampleInput").value;
    if (!preSampleText.trim()) {
        document.getElementById("result").innerText = "Please enter a sample text for reference.";
        return;
    }
    sampleFeatures = extractFeatures(preSampleText);
    document.getElementById("result").innerText = "Sample style saved successfully!";
}

function compareStyle() {
    if (!sampleFeatures) {
        document.getElementById("result").innerText = "Please save a sample style first.";
        return;
    }

    const enteredText = document.getElementById("textInput").value;
    if (!enteredText.trim()) {
        document.getElementById("result").innerText = "Please enter some text to compare.";
        return;
    }

    const enteredTextFeatures = extractFeatures(enteredText);
    const similarityScore = analyzeSimilarity(sampleFeatures, enteredTextFeatures);

    document.getElementById("result").innerText = `Style Similarity Score: ${similarityScore.toFixed(2)}%`;
}

function extractFeatures(text) {
    const doc = nlp(text);
    return {
        sentenceCount: doc.sentences().length,
        wordCount: doc.wordCount(),
        uniqueWords: doc.unique().out('array').length,
        avgSentenceLength: doc.wordCount() / doc.sentences().length,
        nouns: doc.nouns().out('array').length,
        verbs: doc.verbs().out('array').length,
        adjectives: doc.adjectives().out('array').length,
        adverbs: doc.adverbs().out('array').length,
    };
}

function analyzeSimilarity(sampleFeatures, textFeatures) {
    let similarityScore = 0;
    const weightFactors = {
        sentenceCount: 1,
        wordCount: 1,
        uniqueWords: 1.5,
        avgSentenceLength: 2,
        nouns: 1,
        verbs: 1,
        adjectives: 1,
        adverbs: 1
    };

    Object.keys(weightFactors).forEach(key => {
        const diff = Math.abs(sampleFeatures[key] - textFeatures[key]);
        const maxVal = Math.max(sampleFeatures[key], textFeatures[key]);
        similarityScore += ((1 - diff / (maxVal || 1)) * weightFactors[key]);
    });

    const maxScore = Object.values(weightFactors).reduce((a, b) => a + b, 0);
    return (similarityScore / maxScore) * 100;
}
