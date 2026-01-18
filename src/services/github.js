// GitHub Contributions Service
// Fetches real contribution data using GitHub's public graph

const GITHUB_USERNAME = 'nishant-iith';

// Use the GitHub Skyline/Contributions API proxy (public, no auth needed)
// This endpoint returns contribution data in a parseable format
export async function fetchContributions(username = GITHUB_USERNAME) {
    try {
        // GitHub's contribution graph can be fetched as HTML and parsed
        // Using a CORS-friendly approach via GitHub's public contribution endpoint
        const response = await fetch(`https://github.com/users/${username}/contributions`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch contributions');
        }
        
        const html = await response.text();
        return parseContributionsFromHTML(html);
    } catch (error) {
        console.error('Error fetching GitHub contributions:', error);
        return null;
    }
}

// Parse the contribution data from GitHub's HTML response
function parseContributionsFromHTML(html) {
    // Create a DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Find all contribution cells (td elements with data-date and data-level)
    const cells = doc.querySelectorAll('td.ContributionCalendar-day');
    
    const contributions = [];
    let totalContributions = 0;
    
    cells.forEach(cell => {
        const date = cell.getAttribute('data-date');
        const level = parseInt(cell.getAttribute('data-level') || '0', 10);
        const count = parseInt(cell.getAttribute('data-count') || '0', 10);
        
        if (date) {
            contributions.push({
                date,
                level,
                count
            });
            totalContributions += count;
        }
    });
    
    // Group by weeks
    const weeks = [];
    let currentWeek = [];
    
    contributions.forEach((day, index) => {
        const dayOfWeek = new Date(day.date).getDay();
        
        if (dayOfWeek === 0 && currentWeek.length > 0) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
        
        currentWeek.push(day);
        
        if (index === contributions.length - 1 && currentWeek.length > 0) {
            weeks.push(currentWeek);
        }
    });
    
    return {
        totalContributions,
        weeks,
        days: contributions
    };
}

// Alternative: Use GitHub's public GraphQL proxy (if CORS issue)
// This is a fallback using a known working approach
export async function fetchContributionsViaProxy(username = GITHUB_USERNAME) {
    try {
        // Use a public contributions API
        const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch contributions');
        }
        
        const data = await response.json();
        return {
            totalContributions: data.total?.lastYear || 0,
            contributions: data.contributions || []
        };
    } catch (error) {
        console.error('Error fetching GitHub contributions via proxy:', error);
        return null;
    }
}

export { GITHUB_USERNAME };
