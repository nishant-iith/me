export interface LeetCodeContribution {
    date: string;
    count: number;
}

export interface LeetCodeData {
    contributions: LeetCodeContribution[];
    totalActiveDays: number;
    solvedProblem: number;
}
