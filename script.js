// Predefined sample representing a specific style (e.g., Shakespeare)
const preSampleText = `To be, or not to be, that is the question:
Whether 'tis nobler in the mind to suffer
The slings and arrows of outrageous fortune,
Or to take arms against a sea of troubles
And by opposing end them.`;

// Trigger analysis when button is clicked
document.getElementById("compareButton").addEventListener("click", compareStyle);

// Main function to compare styles
async function compareStyle() {
    const enteredText = document.getElementById("textInput").value;
    if (!enteredText.trim()) {
        document.getElementById("result").innerText = "Please enter some text to compare.";
        return;
    }

    const preSampleFeatures = extractFeatures(preSampleText);
    const enteredTextFeatures = extractFeatures(enteredText);

    // Calculate similarity score based on features
    const similarityScore = analyzeSimilarity(preSampleFeatures, enteredTextFeatures);

    document.getElementById("result").innerText = `Style Similarity Score: ${similarityScore.toFixed(2)}%`;
}

// Extracts NLP features from the text using Compromise.js
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

// Calculate similarity score between two sets of features
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

    // Normalize score to percentage (0-100)
    const maxScore = Object.values(weightFactors).reduce((a, b) => a + b, 0);
    return (similarityScore / maxScore) * 100;
        }
