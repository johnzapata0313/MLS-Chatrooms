// betting/betting-widget.js

const API_KEY = "ab47cddb01d0a7c243c1d5ad9ce9e70e";
const BASE_URL = "https://v3.football.api-sports.io";
const MLS_LEAGUE_ID = 253;

export function initBettingWidget(containerId) {
  const container = document.getElementById(containerId);
  
  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return;
  }
  
  container.innerHTML = `
    <div class="betting-ticker-container">
      <div class="ticker-label">MLS BETTING</div>
      <div class="ticker-content" id="ticker-content">
        <span class="ticker-item">Loading betting insights...</span>
      </div>
      <div class="ticker-controls">
        <button class="ticker-btn" id="prevBtn">‹</button>
        <button class="ticker-btn" id="nextBtn">›</button>
      </div>
    </div>
  `;
  
  loadBettingTicker();
}

async function loadBettingTicker() {
  const now = new Date();
  const mlsCupDate = new Date('2025-12-06T19:30:00');
  
  // Show MLS Cup static data until Dec 7, 2025
  if (now >= new Date('2024-11-01') && now < new Date('2025-12-07')) {
    console.log("Showing MLS Cup 2025 Final ticker");
    displayMLSCupTicker();
    return;
  }
  
  // Otherwise, try to fetch live API data
  try {
    let currentSeason = getCurrentSeason();
    console.log("Fetching data for season:", currentSeason);
    
    let fixtures = await fetchUpcomingFixtures(currentSeason);
    console.log("Fixtures found:", fixtures?.length || 0);
    
    // Fallback to 2024 if 2025 not available (free tier)
    if ((!fixtures || fixtures.length === 0) && currentSeason === 2025) {
      console.log("No 2025 data, falling back to 2024...");
      currentSeason = 2024;
      fixtures = await fetchUpcomingFixtures(currentSeason);
    }
    
    if (!fixtures || fixtures.length === 0) {
      displayOffseasonTicker();
      return;
    }
    
    // Get next match and stats
    const nextMatch = fixtures[0];
    const [homeStats, awayStats] = await Promise.all([
      fetchTeamStats(nextMatch.teams.home.id, currentSeason),
      fetchTeamStats(nextMatch.teams.away.id, currentSeason)
    ]);
    
    displayLiveMatchTicker(nextMatch, homeStats, awayStats);
    
  } catch (error) {
    console.error("Error loading ticker:", error);
    displayMLSCupTicker(); // Fallback to MLS Cup
  }
}

function getCurrentSeason() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  if (currentMonth === 0) {
    return currentYear;
  } else if (currentMonth === 1 && now.getDate() < 15) {
    return currentYear;
  } else {
    return currentYear;
  }
}

async function fetchUpcomingFixtures(season) {
  const response = await fetch(`${BASE_URL}/fixtures?league=${MLS_LEAGUE_ID}&season=${season}&next=5&timezone=America/New_York`, {
    method: 'GET',
    headers: {
      'x-rapidapi-key': API_KEY,
      'x-rapidapi-host': 'v3.football.api-sports.io'
    }
  });
  
  if (!response.ok) {
    throw new Error(`API returned ${response.status}`);
  }
  
  const data = await response.json();
  return data.response || [];
}

async function fetchTeamStats(teamId, season) {
  try {
    const response = await fetch(`${BASE_URL}/teams/statistics?league=${MLS_LEAGUE_ID}&season=${season}&team=${teamId}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io'
      }
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.response || null;
  } catch (error) {
    return null;
  }
}

function displayMLSCupTicker() {
  const now = new Date();
  const mlsCupDate = new Date('2025-12-06T19:30:00');
  const daysUntil = Math.ceil((mlsCupDate - now) / (1000 * 60 * 60 * 24));
  
  const tickerItems = [
    `MLS CUP FINAL: Inter Miami vs Vancouver Whitecaps`,
    `DATE: Saturday, Dec 6, 2025 | 2:30 PM ET | Chase Stadium, Fort Lauderdale`,
    `WATCH: FOX, FOX Deportes, MLS Season Pass`,
    `${daysUntil === 0 ? 'MATCH DAY!' : daysUntil === 1 ? 'TOMORROW!' : `${daysUntil} DAYS AWAY`}`,
    `VALUE PICK: Over 2.5 Goals - Both teams have strong attacks`,
    `VALUE PICK: Both Teams to Score - High-scoring potential`,
    `VALUE PICK: Messi Anytime Goalscorer - Excellent playoff form`,
    `VALUE PICK: Miami ML - Home advantage + best record`,
    `AVOID: Large Handicaps (-1.5, -2) - Finals are typically close`,
    `AVOID: First Half Over - Teams start cautiously in championships`,
    `TIP: Home teams win 65% of MLS Cup Finals since 2012`,
    `TIP: Wait 15-20 min for live betting to assess momentum`,
    `TIP: 40% of recent finals go to extra time - consider this outcome`
  ];
  
  startTicker(tickerItems);
}

function displayLiveMatchTicker(match, homeStats, awayStats) {
  const matchDate = new Date(match.fixture.date);
  const now = new Date();
  const daysUntil = Math.ceil((matchDate - now) / (1000 * 60 * 60 * 24));
  
  const formattedDate = matchDate.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric'
  });
  
  const formattedTime = matchDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  });
  
  const homeForm = homeStats?.form || 'N/A';
  const awayForm = awayStats?.form || 'N/A';
  const homeGoalsAvg = homeStats?.goals?.for?.average?.total || 0;
  const awayGoalsAvg = awayStats?.goals?.for?.average?.total || 0;
  const totalGoalsExpected = (parseFloat(homeGoalsAvg) + parseFloat(awayGoalsAvg)).toFixed(1);
  
  const homeWinRate = homeStats?.fixtures?.wins?.total 
    ? ((homeStats.fixtures.wins.total / homeStats.fixtures.played.total) * 100).toFixed(0)
    : 0;
  
  const isPlayoffs = match.league.round?.toLowerCase().includes('playoff') || 
                     match.league.round?.toLowerCase().includes('final') ||
                     matchDate.getMonth() >= 9;
  
  const tickerItems = [
    `${isPlayoffs ? 'PLAYOFFS' : 'NEXT MATCH'} - ${match.league.round || 'Match'}: ${match.teams.home.name} vs ${match.teams.away.name}`,
    `DATE: ${formattedDate} | ${formattedTime} | ${match.fixture.venue.name}`,
    `${daysUntil === 0 ? 'MATCH DAY!' : daysUntil === 1 ? 'TOMORROW!' : `${daysUntil} DAYS AWAY`}`,
    homeForm !== 'N/A' ? `FORM: ${match.teams.home.name} (${homeForm}) vs ${match.teams.away.name} (${awayForm})` : null,
    homeWinRate > 0 ? `STATS: ${match.teams.home.name} home win rate: ${homeWinRate}%` : null,
    totalGoalsExpected > 0 ? `EXPECTED GOALS: ${totalGoalsExpected} ${totalGoalsExpected > 2.5 ? '(Over 2.5 looks good)' : '(Under 2.5 may have value)'}` : null,
    `TIP: Home teams in MLS win ~45% of matches`,
    `TIP: Wait 15-20 min before placing live bets`,
    `TIP: Recent form (last 5) is more predictive than season stats`,
    isPlayoffs ? `PLAYOFF TIP: Games tend to be lower-scoring and more defensive` : null
  ].filter(Boolean);
  
  startTicker(tickerItems);
}

function displayOffseasonTicker() {
  const tickerItems = [
    `MLS OFFSEASON - Next season starts February 2025`,
    `Check back during the season for live betting insights!`
  ];
  
  startTicker(tickerItems);
}

function startTicker(items) {
  const tickerContent = document.getElementById('ticker-content');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  let currentIndex = 0;
  let intervalId;
  
  function showItem(index) {
    tickerContent.innerHTML = `<span class="ticker-item">${items[index]}</span>`;
  }
  
  function nextItem() {
    currentIndex = (currentIndex + 1) % items.length;
    showItem(currentIndex);
  }
  
  function prevItem() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    showItem(currentIndex);
  }
  
  function resetInterval() {
    clearInterval(intervalId);
    intervalId = setInterval(nextItem, 5000); // Rotate every 5 seconds
  }
  
  // Show first item
  showItem(currentIndex);
  
  // Auto-rotate
  resetInterval();
  
  // Manual controls
  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
      nextItem();
      resetInterval();
    });
    
    prevBtn.addEventListener('click', () => {
      prevItem();
      resetInterval();
    });
  }
  
  // Pause on hover
  tickerContent.addEventListener('mouseenter', () => {
    clearInterval(intervalId);
  });
  
  tickerContent.addEventListener('mouseleave', () => {
    resetInterval();
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initBettingWidget };
}