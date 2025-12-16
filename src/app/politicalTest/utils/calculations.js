export const calculateUserTraits = (answers, questions) => {
  const traits = {};

  answers.forEach((answerIndex, questionIndex) => {
    if (answerIndex === null || answerIndex === undefined) return;

    const question = questions[questionIndex];
    if (!question || !question.options[answerIndex]) return;

    const option = question.options[answerIndex];

    if (option.traits) {
      Object.entries(option.traits).forEach(([trait, weight]) => {
        traits[trait] = (traits[trait] || 0) + weight;
      });
    }
  });

  return traits;
};

export const cosineSimilarity = (vec1, vec2) => {
  const allKeys = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);

  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  allKeys.forEach(key => {
    const val1 = vec1[key] || 0;
    const val2 = vec2[key] || 0;

    dotProduct += val1 * val2;
    mag1 += val1 * val1;
    mag2 += val2 * val2;
  });

  const magnitude = Math.sqrt(mag1) * Math.sqrt(mag2);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
};

export const euclideanDistance = (vec1, vec2) => {
  const allKeys = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);

  let sum = 0;
  allKeys.forEach(key => {
    const diff = (vec1[key] || 0) - (vec2[key] || 0);
    sum += diff * diff;
  });

  return Math.sqrt(sum);
};

export const calculateSimilarity = (userTraits, leaderTraits) => {
  const leaderVector = leaderTraits || {};

  const cosineScore = cosineSimilarity(userTraits, leaderVector);
  const euclideanDist = euclideanDistance(userTraits, leaderVector);

  const maxDist = 100;
  const euclideanNorm = 1 - Math.min(euclideanDist / maxDist, 1);

  const combinedScore = (cosineScore * 0.7) + (euclideanNorm * 0.3);
  return Math.max(0, Math.min(1, combinedScore));
};

export const findBestMatch = (userTraits, leaders) => {
  let bestScore = -Infinity;
  let bestLeader = null;

  leaders.forEach(leader => {
    const similarity = calculateSimilarity(userTraits, leader.traits);
    
    if (similarity > bestScore) {
      bestScore = similarity;
      bestLeader = leader;
    }
  });

  const percentage = Math.round(bestScore * 100);

  return {
    ...bestLeader,
    score: bestScore,
    percentage: percentage
  };
};