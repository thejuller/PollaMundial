import { MatchData } from './api';

/**
 * Determines if a match is in its "active window"
 * Active window = 2 hours before kickoff until match is finished
 */
export function isMatchInActiveWindow(match: MatchData): boolean {
    const now = new Date();
    const kickoff = new Date(match.utcDate);

    // If match is IN_PLAY, definitely active
    if (match.status === 'IN_PLAY') {
        return true;
    }

    // If match is finished, not active
    if (match.status === 'FINISHED') {
        return false;
    }

    // Check if within 2 hours before kickoff
    const twoHoursBefore = new Date(kickoff.getTime() - 2 * 60 * 60 * 1000);
    const twoHoursAfter = new Date(kickoff.getTime() + 3 * 60 * 60 * 1000); // 3 hours for match duration

    return now >= twoHoursBefore && now <= twoHoursAfter;
}

/**
 * Checks if any match in the list is in active window
 */
export function hasActiveMatches(matches: MatchData[]): boolean {
    return matches.some(match => isMatchInActiveWindow(match));
}

/**
 * Gets all matches currently in their active window
 */
export function getActiveMatches(matches: MatchData[]): MatchData[] {
    return matches.filter(match => isMatchInActiveWindow(match));
}

/**
 * Determines optimal revalidation time based on match states
 * Returns seconds
 */
export function getOptimalRevalidationTime(matches: MatchData[]): number {
    const hasActive = hasActiveMatches(matches);

    // If there are active matches, revalidate every 30 seconds
    if (hasActive) {
        return 30;
    }

    // Check if there's a match starting in the next 3 hours
    const now = new Date();
    const upcomingMatch = matches.find(match => {
        const kickoff = new Date(match.utcDate);
        const threeHoursFromNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);
        return match.status === 'SCHEDULED' && kickoff <= threeHoursFromNow && kickoff > now;
    });

    if (upcomingMatch) {
        // Revalidate every 5 minutes if match starting soon
        return 300;
    }

    // Default: revalidate every hour
    return 3600;
}
