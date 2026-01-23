export interface CodeforcesContribution {
    date: string;
    count: number;
}

export interface CodeforcesData {
    contributions: CodeforcesContribution[];
    total: number;
    rating: number;
    rank: string;
}
