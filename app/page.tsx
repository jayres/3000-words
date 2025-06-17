'use client';

import { useState, useEffect, useCallback } from 'react';
import a1Data from '../spanish_ai_terms/a1.json';
import a2Data from '../spanish_ai_terms/a2.json';

interface Word {
  id: number;
  spanish: string;
  english: string;
  chinese: string;
  category: string;
  level: string;
}

type Level = 'A1' | 'A2';
type Language = 'english' | 'chinese';

export default function Home() {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(120); // 3 minutes in seconds
  const [isGameOver, setIsGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState<Level>('A1');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('english');

  const getCurrentLevelData = () => {
    return currentLevel === 'A1' ? a1Data : a2Data;
  };

  const getRandomWord = () => {
    const data = getCurrentLevelData();
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
  };

  const getRandomOptions = useCallback((correctAnswer: string, language: Language) => {
    const data = getCurrentLevelData();
    const allOptions = data.map(word => word[language]);
    const filteredOptions = allOptions.filter(option => option !== correctAnswer);
    const shuffled = filteredOptions.sort(() => 0.5 - Math.random());
    const wrongOptions = shuffled.slice(0, 3);
    const allChoices = [...wrongOptions, correctAnswer];
    return allChoices.sort(() => 0.5 - Math.random());
  }, []);

  const startNewRound = useCallback(() => {
    const newWord = getRandomWord();
    const options = getRandomOptions(newWord[currentLanguage], currentLanguage)
    setCurrentWord(newWord);
    setOptions(options);
    setMessage('');
  }, [currentLanguage]);

  const startNewGame = () => {
    setScore(0);
    setTimeLeft(120);
    setIsGameOver(false);
    startNewRound();
  };

  const handleLevelChange = (level: Level) => {
    setCurrentLevel(level);
    setScore(0);
    setTimeLeft(120);
    setIsGameOver(false);
    startNewRound();
  };

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    const newWord = getRandomWord();
    const newOptions = getRandomOptions(newWord[language], language);
    setCurrentWord(newWord);
    setOptions(newOptions);
    setMessage('');
  };

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
    startNewRound();
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isGameOver) return;

      const key = event.key;
      if (['1', '2', '3', '4'].includes(key)) {
        const index = parseInt(key) - 1;
        if (index >= 0 && index < options.length) {
          handleAnswer(options[index]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [options, isGameOver]);

  const handleAnswer = (selectedAnswer: string) => {
    if (selectedAnswer === currentWord?.[currentLanguage]) {
      setScore(prev => prev + 1);
      setMessage('Correct! 🎉');
      setTimeout(() => {
        startNewRound();
      }, 200);
    } else {
      setMessage('Try again! ❌');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isGameOver) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-6">Game Over!</h1>
          <p className="text-xl mb-4">Final Score: {score}</p>
          <p className="text-lg mb-8">High Score: {highScore}</p>
          <button
            onClick={startNewGame}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="flex space-x-2 mb-6 mt-6">
        <button
          onClick={() => handleLevelChange('A1')}
          className={`flex-1 py-2 px-4 rounded-lg transition-colors ${currentLevel === 'A1'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          A1 Level
        </button>
        <button
          onClick={() => handleLevelChange('A2')}
          className={`flex-1 py-2 px-4 rounded-lg transition-colors ${currentLevel === 'A2'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          A2 Level
        </button>
      </div>
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
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center text-lg"
            >
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                {index + 1}
              </span>
              {option}
            </button>
          ))}
        </div>
        <p className={`mt-4 text-center h-10 font-semibold ${message.includes('Correct') ? 'text-green-600' : 'text-red-600'}`}>
          {message} {' '}
        </p>
        <div className="mt-3 text-center">
          <p className="text-2xl font-semibold">Score: {score}</p>
          <p className="text-sm text-gray-600 mt-2">Press 1-4 to select an answer</p>
        </div>
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => handleLanguageChange('english')}
            className={`px-4 py-2 rounded-lg transition-colors ${currentLanguage === 'english'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            English
          </button>
          <button
            onClick={() => handleLanguageChange('chinese')}
            className={`px-4 py-2 rounded-lg transition-colors ${currentLanguage === 'chinese'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            中文
          </button>
        </div>
      </div>
    </div>
  );
}
