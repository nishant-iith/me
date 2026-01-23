export interface ContributionDay {
    date: string;
    count: number;
    level: number;
}

export interface GithubContributions {
    totalContributions: number;
    contributions: ContributionDay[];
}
