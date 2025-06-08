export type Article = {
    id: number,
    url: string,
    title: string,
    content: string,
    timestamp: Date,
    processedTimestamp?: Date
}
export type MarketEvent = {
    id: number;
    type: MarketEventType; // 0 - negatywny wpływ, 1 - pozytywny
    impactPrc: number; // 0–10
    impactChance: number; // 0–10
    startTimestamp: Date; // albo string jeśli nie parsujesz od razu
    endTimestamp: Date;
    scream: string;
    article?: Article;
}
export enum MarketEventType {
    Negatywny = 0,
    Pozytywny = 1,
}