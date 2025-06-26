export enum Level {
    A1 = 'A1',
    A2 = 'A2',
    Verbs = 'VERBS'
}

export enum Language {
    English = 'english',
    Chinese = 'chinese'
}

export interface Word {
    id: number;
    spanish: string;
    [Language.English]: string;
    [Language.Chinese]: string;
    category: string;
    level: string;
}