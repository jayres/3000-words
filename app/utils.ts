import { Language, Level, Word } from "./types";
import A2_DATA from '../spanish_ai_terms/a1.json';
import A1_DATA from '../spanish_ai_terms/a2.json';
import VERBS_DATA from '../spanish_ai_terms/verbs.json';

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getCurrentLevelData = (level: Level) => {
  switch (level) {
    case Level.A1:
      return A1_DATA;
    case Level.A2:
      return A2_DATA;
    case Level.Verbs:
      return VERBS_DATA;
    default:
      return []
  }
}

export const getRandomWord = (levelWords: Word[]) => {
  const randomIndex = Math.floor(Math.random() * levelWords.length);
  return levelWords[randomIndex];
}

export const getRandomOptions = (correctAnswer: Word, levelWords: Word[]) => {
  const filteredOptions = levelWords.filter(option => option.spanish !== correctAnswer.spanish);
  // Fisher-Yates shuffle implementation
  const shuffle = (array: Word[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  // Shuffle filtered options and take first 3
  const wrongOptions = shuffle([...filteredOptions]).slice(0, 4);
  const allChoices = [...wrongOptions, correctAnswer];
  // Shuffle final array
  return shuffle(allChoices);
}

export const answerQuestion = async ({
  currentOptions,
  currentWord,
  levelWords,
  selectedAnswer,
  setMessage,
  setCurrentOptions,
  setCurrentWord,
  setScore
}: {
  currentOptions: Word[];
  currentWord: Word;
  levelWords: Word[]
  selectedAnswer: Word;
  setCurrentOptions: React.Dispatch<React.SetStateAction<Word[]>>;
  setCurrentWord: React.Dispatch<React.SetStateAction<Word | undefined>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}) => {
  // Check if selection is correct
  // If no, set message to WRONG
  if (selectedAnswer.id !== currentWord.id) return setMessage('Try again! ❌');
  // If so, set message to CORRECT for 200ms & increment the score
  setMessage('Correct! 🎉');
  setScore(prev => prev + 1);
  setTimeout(() => startNewRound({ levelWords, setCurrentOptions, setCurrentWord }), 200);
}

export const startNewRound = async ({
  levelWords,
  setCurrentWord,
  setCurrentOptions
}: {
  levelWords: Word[];
  setCurrentWord: React.Dispatch<React.SetStateAction<Word | undefined>>;
  setCurrentOptions: React.Dispatch<React.SetStateAction<Word[]>>;
}) => {
  // Get a new word from the levelWords
  const newWord = getRandomWord(levelWords)
  // Get new options from levelWords
  const newOptions = getRandomOptions(newWord, levelWords)
  // Set current word & options
  setCurrentWord(newWord);
  return setCurrentOptions(newOptions);
}

export const startNewGame = async (
  levelWords: Word[],
  setScore: React.Dispatch<React.SetStateAction<number>>,
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>,
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentWord: React.Dispatch<React.SetStateAction<Word | undefined>>,
  setCurrentOptions: React.Dispatch<React.SetStateAction<Word[]>>
): Promise<void> => {
  // Reset score, timer, and isGameOver
  setScore(0);
  setTimeLeft(120); // 2 minutes
  setIsGameOver(false);

  // Start a new round
  await startNewRound({ levelWords, setCurrentWord, setCurrentOptions });
};

