'use client';

import { useState, useEffect, useMemo } from 'react';
import GameOverScreen from './components/GameOverScreen';
import { Word, Level, Language } from './types';
import { answerQuestion, formatTime, getCurrentLevelData, startNewGame } from './utils';
import LanguageChange from './components/LanguageSelect';
import DifficultySelect from './components/DifficultySelect';

export default function Home() {
  const [currentWord, setCurrentWord] = useState<Word | undefined>();
  const [currentOptions, setCurrentOptions] = useState<Word[]>([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [isGameOver, setIsGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const [currentLevel, setCurrentLevel] = useState<Level>(Level.A1);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(Language.English);

  const levelWords = useMemo(() => getCurrentLevelData(currentLevel), [currentLevel]);

  useEffect(() => {
    if (!isGameOver) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsGameOver(true);
            setHighScore(Math.max(score, highScore));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isGameOver, score, highScore]);

  useEffect(() => {
    if (levelWords.length === 0) return;
    startNewGame(levelWords, setScore, setTimeLeft, setIsGameOver, setCurrentWord, setCurrentOptions);
  }, [levelWords]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isGameOver || !currentWord) return;

      const key = event.key;
      if (['1', '2', '3', '4', '5'].includes(key)) {
        const index = parseInt(key) - 1;
        if (index >= 0 && index < currentOptions.length) {
          answerQuestion({
            currentWord,
            levelWords,
            selectedAnswer: currentOptions[index],
            setMessage,
            setCurrentOptions,
            setCurrentWord,
            setScore
          });
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentOptions, currentWord, isGameOver, levelWords]);

  if (!currentWord) return <p>...Loading</p>; // TODO: Add loading state
  if (isGameOver) return <GameOverScreen highScore={highScore} score={score} startNewGame={() => startNewGame(levelWords, setScore, setTimeLeft, setIsGameOver, setCurrentWord, setCurrentOptions)} />

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <DifficultySelect currentLevel={currentLevel} handleLevelChange={(level) => setCurrentLevel(level)} />
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="flex flex-col justify-center items-center mb-8">
          <p className="text-2xl font-bold text-blue-600">{formatTime(timeLeft)}</p>
          <p className="text-sm text-gray-500">Time Remaining</p>
        </div>

        <div className="text-center mb-6">
          <p className="text-4xl font-bold mb-2">{currentWord?.spanish}</p>
          <p className="text-gray-600">Category: {currentWord?.category}</p>
        </div>
        <div className="space-y-3">
          {currentOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => answerQuestion({
                currentWord,
                levelWords,
                selectedAnswer: option,
                setMessage,
                setCurrentOptions,
                setCurrentWord,
                setScore
              })}
              className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center text-lg"
            >
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                {index + 1}
              </span>
              {option[currentLanguage]}
            </button>
          ))}
        </div>
        <p className={`mt-4 text-center h-10 font-semibold ${message.includes('Correct') ? 'text-green-600' : 'text-red-600'}`}>
          {message} {' '}
        </p>
        <div className="mt-3 text-center">
          <p className="text-2xl font-semibold">Score: {score}</p>
          <p className="text-sm text-gray-600 mt-2">Press 1-5 to select an answer</p>
        </div>
        <LanguageChange currentLanguage={currentLanguage} setCurrentLanguage={setCurrentLanguage} />
      </div>
      <p className='text-gray-300 text-sm text-center mt-3'>&#169; {new Date().getFullYear()} James Ayres</p>
    </div>
  );
}
