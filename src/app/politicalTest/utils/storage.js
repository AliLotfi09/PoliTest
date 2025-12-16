const STORAGE_KEYS = {
  RESULT: 'politicalTestResult',
  ANSWERS: 'politicalTestAnswers',
  TRAITS: 'politicalTestTraits'
};

export const saveTestResults = (result, answers, traits) => {
  try {
    localStorage.setItem(STORAGE_KEYS.RESULT, JSON.stringify(result));
    localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(answers));
    localStorage.setItem(STORAGE_KEYS.TRAITS, JSON.stringify(traits));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

export const loadTestResults = () => {
  try {
    const savedResult = localStorage.getItem(STORAGE_KEYS.RESULT);
    const savedAnswers = localStorage.getItem(STORAGE_KEYS.ANSWERS);
    const savedTraits = localStorage.getItem(STORAGE_KEYS.TRAITS);

    if (savedResult && savedAnswers && savedTraits) {
      return {
        result: JSON.parse(savedResult),
        answers: JSON.parse(savedAnswers),
        traits: JSON.parse(savedTraits)
      };
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }

  return null;
};

export const clearTestResults = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

export const hasSavedResults = () => {
  return localStorage.getItem(STORAGE_KEYS.RESULT) !== null;
};