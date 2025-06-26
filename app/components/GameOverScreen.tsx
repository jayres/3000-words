interface GameOverScreenProps {
  highScore?: number;
  score: number;
  startNewGame: () => void;
}

const GameOverScreen = ({ highScore, score, startNewGame }: GameOverScreenProps) => (
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

export default GameOverScreen;
