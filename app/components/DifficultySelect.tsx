import { Level } from "../types";

interface DifficultySelectProps {
    currentLevel: Level;
    handleLevelChange: (arg0: Level) => void;
}

const DifficultySelect = ({ currentLevel, handleLevelChange }: DifficultySelectProps) => (
    <div className="flex space-x-2 mb-6 mt-6">
        <button
            onClick={() => handleLevelChange(Level.A1)}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${currentLevel === 'A1'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
        >
            A1 Level
        </button>
        <button
            onClick={() => handleLevelChange(Level.A2)}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${currentLevel === 'A2'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
        >
            A2 Level
        </button>
        <button
            onClick={() => handleLevelChange(Level.Verbs)}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${currentLevel === 'VERBS'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
        >
            Verbs
        </button>
    </div>
)

export default DifficultySelect