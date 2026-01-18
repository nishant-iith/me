// LeetCode Contributions Service
// Fetches submission calendar data from LeetCode

const LEETCODE_USERNAME = 'Nishant-iith';

export async function fetchLeetCodeContributions(username = LEETCODE_USERNAME) {
    try {
        // Using alfa-leetcode-api for submission calendar
        const response = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/calendar`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch LeetCode data');
        }
        
        const data = await response.json();
        return processLeetCodeData(data);
    } catch (error) {
        console.error('Error fetching LeetCode contributions:', error);
        return null;
    }
}

function processLeetCodeData(data) {
    // LeetCode returns submissionCalendar as { timestamp: count }
    const calendar = data.submissionCalendar || {};
    const contributions = [];
    
    Object.entries(calendar).forEach(([timestamp, count]) => {
        const date = new Date(parseInt(timestamp) * 1000);
        contributions.push({
            date: date.toISOString().split('T')[0],
            count: parseInt(count)
        });
    });
    
    // Sort by date
    contributions.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return {
        contributions,
        totalSubmissions: data.totalActiveDays || contributions.reduce((sum, d) => sum + d.count, 0)
    };
}

export { LEETCODE_USERNAME };
