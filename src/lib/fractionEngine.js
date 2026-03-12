export const compareFractions = (n1, d1, n2, d2) => {
    const v1 = n1 / d1;
    const v2 = n2 / d2;
    // Account for floating point precision issues
    if (Math.abs(v1 - v2) < 0.00001) return '=';
    return v1 < v2 ? '<' : '>';
};

// Generates a random integer between min and max (inclusive)
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Type 1: Same Denominator (e.g., 3/8 vs 5/8)
const generateSameDenominator = (difficultyLevel) => {
    const maxD = difficultyLevel < 3 ? 12 : 24;
    const d = randomInt(3, maxD);
    const n1 = randomInt(1, d - 1);
    let n2 = randomInt(1, d - 1);
    while (n2 === n1) n2 = randomInt(1, d - 1); // Ensure they're different
    return { n1, d1: d, n2, d2: d, type: 'same_denom' };
};

// Type 2: Same Numerator (e.g., 4/5 vs 4/9)
const generateSameNumerator = (difficultyLevel) => {
    const n = randomInt(2, difficultyLevel < 3 ? 6 : 10);
    const minD = n + 1; // Proper fractions
    const d1 = randomInt(minD, minD + 8);
    let d2 = randomInt(minD, minD + 8);
    while (d2 === d1) d2 = randomInt(minD, minD + 8); // Ensure different
    return { n1: n, d1, n2: n, d2, type: 'same_numer' };
};

// Type 3: Benchmark (comparing against 1/2) (e.g., 3/8 vs 7/12)
// One is clearly less than 1/2, one is clearly greater than 1/2
const generateBenchmark = (difficultyLevel) => {
    const maxD = difficultyLevel < 3 ? 12 : 20;

    // Fraction 1: Less than 1/2
    const d1 = randomInt(4, maxD);
    // Max numerator strictly less than half
    const maxN1 = Math.floor((d1 - 1) / 2);
    const n1 = maxN1 > 1 ? randomInt(1, maxN1) : 1;

    // Fraction 2: Greater than 1/2
    const d2 = randomInt(4, maxD);
    // Min numerator strictly greater than half
    const minN2 = Math.floor(d2 / 2) + 1;
    const n2 = minN2 < d2 ? randomInt(minN2, d2 - 1) : d2 - 1;

    // Randomize order
    if (Math.random() > 0.5) {
        return { n1, d1, n2, d2, type: 'benchmark' };
    } else {
        return { n1: n2, d1: d2, n2: n1, d2: d1, type: 'benchmark' };
    }
};

// Type 4: Unlike (no obvious relationship, requires common denominator or cross-multiplication)
const generateUnlike = (difficultyLevel) => {
    const maxD = difficultyLevel < 3 ? 10 : 15;
    let d1, d2, n1, n2;
    let valid = false;

    while (!valid) {
        d1 = randomInt(3, maxD);
        d2 = randomInt(3, maxD);
        // Don't want same denominator, or one being multiple of another too simply
        if (d1 === d2) continue;

        n1 = randomInt(1, d1 - 1);
        n2 = randomInt(1, d2 - 1);

        // Rule out same numerators or equivalent fractions
        if (n1 === n2 || compareFractions(n1, d1, n2, d2) === '=') continue;

        // Rule out benchmark easy cases if we can
        const v1 = n1 / d1;
        const v2 = n2 / d2;
        if ((v1 < 0.5 && v2 > 0.5) || (v1 > 0.5 && v2 < 0.5)) {
            // It's a benchmark problem, try again unless difficulty is low
            if (difficultyLevel > 2) continue;
        }

        valid = true;
    }
    return { n1, d1, n2, d2, type: 'unlike' };
};

// The core problem generator
export const generateProblem = (sessionState) => {
    // sessionState: { total_attempted, streak_max, difficulty (1 to 5) }
    const attempt = sessionState.total_attempted || 0;
    const diff = sessionState.difficulty || 1;

    // Implicit diagnostic phase (first 6 problems)
    if (attempt < 6) {
        // 0, 1 -> same denom
        // 2, 3 -> same numer
        // 4 -> benchmark
        // 5 -> unlike
        if (attempt < 2) return generateSameDenominator(diff);
        if (attempt < 4) return generateSameNumerator(diff);
        if (attempt === 4) return generateBenchmark(diff);
        return generateUnlike(diff);
    }

    // Adaptive phase - probability based on difficulty
    const r = Math.random();

    if (diff <= 2) {
        // Mostly easier types
        if (r < 0.4) return generateSameDenominator(diff);
        if (r < 0.8) return generateSameNumerator(diff);
        if (r < 0.95) return generateBenchmark(diff);
        return generateUnlike(diff);
    } else if (diff === 3) {
        // Mix
        if (r < 0.2) return generateSameDenominator(diff);
        if (r < 0.4) return generateSameNumerator(diff);
        if (r < 0.7) return generateBenchmark(diff);
        return generateUnlike(diff);
    } else {
        // Mostly harder types
        if (r < 0.1) return generateSameDenominator(diff);
        if (r < 0.2) return generateSameNumerator(diff);
        if (r < 0.5) return generateBenchmark(diff);
        return generateUnlike(diff);
    }
};
