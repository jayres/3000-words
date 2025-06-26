import { Language } from "../types";

interface LanguageChangeProps {
    currentLanguage: Language;
    setCurrentLanguage: (arg0: Language) => void;
}

const LanguageChange = ({ currentLanguage, setCurrentLanguage }: LanguageChangeProps) => (
    <div className="mt-6 flex justify-center space-x-4">
        <button
            onClick={() => setCurrentLanguage(Language.English)}
            className={`px-4 py-2 rounded-lg transition-colors ${currentLanguage === Language.English
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
        >
            English
        </button>
        <button
            onClick={() => setCurrentLanguage(Language.Chinese)}
            className={`px-4 py-2 rounded-lg transition-colors ${currentLanguage === Language.Chinese
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
        >
            中文
        </button>
    </div>
)

export default LanguageChange