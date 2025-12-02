// trends-generator.js
// Backend logic for generating betting trends from MLS data

class MLSTrendsGenerator {
  constructor(apiClient) {
    this.apiClient = apiClient; // Your MLS API client
  }

  /**
   * Main function to generate all betting trends
   * Call this endpoint every 5-10 minutes to refresh trends
   */
  async generateAllTrends() {
    try {
      const [
        goalTrends,
        assistTrends,
        teamFormTrends,
        underdogTrends
      ] = await Promise.all([
        this.getGoalScoringTrends(),
        this.getAssistTrends(),
        this.getTeamFormTrends(),
        this.getUnderdogTrends()
      ]);

      // Combine and sort by confidence/priority
      const allTrends = [
        ...goalTrends,
        ...assistTrends,
        ...teamFormTrends,
        ...underdogTrends
      ];

      // Return top 5-7 trends
      return allTrends
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 7);
    } catch (error) {
      console.error('Error generating trends:', error);
      return [];
    }
  }

  /**
   * Find players on hot goal-scoring streaks
   */
  async getGoalScoringTrends() {
    // Fetch recent player stats from your API
    const recentGames = 5; // Last 5 games
    const players = await this.apiClient.getPlayerStats({ 
      limit: 50,
      sortBy: 'goals',
      games: recentGames 
    });

    const trends = [];

    for (const player of players) {
      const goalsInPeriod = player.recentGoals || 0;
      const gamesPlayed = player.gamesPlayed || recentGames;
      const scoringRate = goalsInPeriod / gamesPlayed;

      // Hot streak: 3+ goals in last 5 games
      if (goalsInPeriod >= 3) {
        trends.push({
          type: 'goal',
          label: 'Hot Scorer',
          description: `${player.name} (${player.team}) has ${goalsInPeriod} goals in last ${gamesPlayed} games`,
          stats: this.getStreakInfo(player),
          confidence: this.calculateConfidence(scoringRate, 0.6), // 60% benchmark
          playerId: player.id,
          teamId: player.teamId
        });
      }
    }

    return trends.slice(0, 2); // Top 2 goal trends
  }

  /**
   * Find players with high assist rates
   */
  async getAssistTrends() {
    const recentGames = 5;
    const players = await this.apiClient.getPlayerStats({ 
      limit: 50,
      sortBy: 'assists',
      games: recentGames 
    });

    const trends = [];

    for (const player of players) {
      const assistsInPeriod = player.recentAssists || 0;
      const gamesPlayed = player.gamesPlayed || recentGames;

      // Strong playmaker: 4+ assists in last 5 games
      if (assistsInPeriod >= 4) {
        trends.push({
          type: 'assist',
          label: 'Playmaker Alert',
          description: `${player.name} (${player.team}) averaging ${(assistsInPeriod / gamesPlayed).toFixed(1)} assists per game`,
          stats: `${assistsInPeriod} assists in last ${gamesPlayed} matches`,
          confidence: this.calculateConfidence(assistsInPeriod / gamesPlayed, 0.8),
          playerId: player.id,
          teamId: player.teamId
        });
      }
    }

    return trends.slice(0, 2);
  }

  /**
   * Identify teams with strong recent form
   */
  async getTeamFormTrends() {
    const recentGames = 7;
    const teams = await this.apiClient.getTeamStats({ 
      games: recentGames 
    });

    const trends = [];

    for (const team of teams) {
      const record = this.calculateRecord(team.recentResults);
      const winRate = record.wins / recentGames;
      const isHomeStreak = team.venue === 'home';

      // Strong form: 5+ wins or unbeaten in 7
      if (record.wins >= 5 || (record.wins >= 4 && record.losses === 0)) {
        const venue = isHomeStreak ? 'home' : 'overall';
        trends.push({
          type: 'win',
          label: 'Strong Form',
          description: `${team.name} ${record.losses === 0 ? 'unbeaten' : 'winning'} in last ${recentGames} ${venue} games`,
          stats: `${record.wins}W-${record.draws}D-${record.losses}L, ${team.goalsScored} goals scored`,
          confidence: this.calculateConfidence(winRate, 0.7),
          teamId: team.id
        });
      }
    }

    return trends.slice(0, 2);
  }

  /**
   * Find potential underdog picks based on recent away form vs odds
   */
  async getUnderdogTrends() {
    const upcomingMatches = await this.apiClient.getUpcomingMatches({ 
      days: 7 
    });
    
    const trends = [];

    for (const match of upcomingMatches) {
      const awayTeam = await this.apiClient.getTeamStats({ 
        teamId: match.awayTeamId,
        venue: 'away',
        games: 5 
      });

      const awayRecord = this.calculateRecord(awayTeam.recentResults);
      const awayWinRate = awayRecord.wins / 5;

      // Underdog criteria: Good away form (60%+ wins) + underdog odds (+200 or higher)
      if (awayWinRate >= 0.6 && match.awayOdds >= 200) {
        trends.push({
          type: 'underdog',
          label: 'Underdog Pick',
          description: `${awayTeam.name} has won ${awayRecord.wins} of last 5 away games`,
          stats: `Currently +${match.awayOdds} odds vs ${match.homeTeam}`,
          confidence: this.calculateConfidence(awayWinRate, 0.6),
          matchId: match.id,
          teamId: awayTeam.id
        });
      }
    }

    return trends.slice(0, 2);
  }

  /**
   * Helper: Calculate team record from results array
   */
  calculateRecord(results) {
    return results.reduce((acc, result) => {
      if (result === 'W') acc.wins++;
      else if (result === 'D') acc.draws++;
      else if (result === 'L') acc.losses++;
      return acc;
    }, { wins: 0, draws: 0, losses: 0 });
  }

  /**
   * Helper: Get scoring streak information
   */
  getStreakInfo(player) {
    if (player.currentStreak >= 3) {
      return `Scoring in ${player.currentStreak} consecutive matches`;
    }
    return `${player.recentGoals} goals in last ${player.gamesPlayed} games`;
  }

  /**
   * Helper: Calculate confidence score (0-100)
   */
  calculateConfidence(actualRate, benchmark) {
    const ratio = actualRate / benchmark;
    return Math.min(100, Math.round(ratio * 75)); // Cap at 100, scale to 75
  }
}

// ==========================================
// EXPRESS ROUTE EXAMPLE
// ==========================================

const express = require('express');
const router = express.Router();

// Initialize your MLS API client
const mlsApiClient = require('./mls-api-client'); // Your API wrapper
const trendsGenerator = new MLSTrendsGenerator(mlsApiClient);

/**
 * GET /api/trends
 * Returns current betting trends
 */
router.get('/api/trends', async (req, res) => {
  try {
    const trends = await trendsGenerator.generateAllTrends();
    
    res.json({
      success: true,
      trends,
      timestamp: new Date().toISOString(),
      expiresIn: 300 // seconds (5 minutes)
    });
  } catch (error) {
    console.error('Trends API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate trends'
    });
  }
});

/**
 * GET /api/trends/:chatroomId
 * Returns trends filtered for a specific chatroom/team
 */
router.get('/api/trends/:chatroomId', async (req, res) => {
  try {
    const { chatroomId } = req.params;
    const allTrends = await trendsGenerator.generateAllTrends();
    
    // Filter trends relevant to this chatroom's team
    const filteredTrends = allTrends.filter(trend => 
      trend.teamId === chatroomId || !trend.teamId
    );
    
    res.json({
      success: true,
      trends: filteredTrends,
      chatroomId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Trends API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate trends'
    });
  }
});

module.exports = router;

// ==========================================
// USAGE EXAMPLE IN YOUR APP
// ==========================================

/*
// In your main server file (e.g., server.js):
const trendsRouter = require('./routes/trends');
app.use(trendsRouter);

// Frontend fetching:
async function fetchTrends() {
  const response = await fetch('/api/trends');
  const data = await response.json();
  return data.trends;
}

// With caching (recommended):
const NodeCache = require('node-cache');
const trendsCache = new NodeCache({ stdTTL: 300 }); // 5 min cache

router.get('/api/trends', async (req, res) => {
  let trends = trendsCache.get('trends');
  
  if (!trends) {
    trends = await trendsGenerator.generateAllTrends();
    trendsCache.set('trends', trends);
  }
  
  res.json({ success: true, trends });
});
*/