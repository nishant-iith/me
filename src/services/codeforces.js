// Codeforces Contributions Service
// Fetches submission data from Codeforces API

const CODEFORCES_USERNAME = 'so-called-iitian';

export async function fetchCodeforcesContributions(username = CODEFORCES_USERNAME) {
    try {
        // Codeforces public API for user submissions (limited to last 1000 for performance)
        const response = await fetch(`https://codeforces.com/api/user.status?handle=${username}&from=1&count=1000`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch Codeforces data');
        }
        
        const data = await response.json();
        
        if (data.status !== 'OK') {
            throw new Error(data.comment || 'Codeforces API error');
        }
        
        return processCodeforcesData(data.result);
    } catch (error) {
        console.error('Error fetching Codeforces contributions:', error);
        return null;
    }
}

function processCodeforcesData(submissions) {
    // Group submissions by date
    const dateMap = {};
    
    submissions.forEach(sub => {
        const date = new Date(sub.creationTimeSeconds * 1000);
        const dateStr = date.toISOString().split('T')[0];
        
        if (!dateMap[dateStr]) {
            dateMap[dateStr] = 0;
        }
        dateMap[dateStr]++;
    });
    
    const contributions = Object.entries(dateMap).map(([date, count]) => ({
        date,
        count
    }));
    
    // Sort by date
    contributions.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Calculate total (submissions in last year)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const lastYearContributions = contributions.filter(c => new Date(c.date) >= oneYearAgo);
    const total = lastYearContributions.reduce((sum, d) => sum + d.count, 0);
    
    return {
        contributions,
        totalSubmissions: total
    };
}

export { CODEFORCES_USERNAME };
