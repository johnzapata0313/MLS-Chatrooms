// betting/mls-api-client.js

const API_KEY = "e506e4ca98msh6bdfe48878a9b2fp1d0148jsn3624dca94d28";
const BASE_URL = "https://api-football-v1.p.rapidapi.com/v3 "; // Replace with your actual MLS API base URL

const matchInfo = document.getElementById("matchInfo");
const getMatch = document.getElementById("getMatch");

// Fetch all MLS teams
function getTeams() {
  const url = `${BASE_URL}/scores/json/Teams`;
  
  fetch(url, { headers: { "Ocp-Apim-Subscription-Key": API_KEY } })
    .then(res => res.json())
    .then(data => {
      console.log("Teams:", data);
      return data;
    })
    .catch(err => {
      console.error("Error fetching teams:", err);
    });
}

// Fetch MLS matches for a specific date
function getMatches(date) {
  const url = `${BASE_URL}/scores/json/GamesByDate/${date}`;
  
  fetch(url, { headers: { "Ocp-Apim-Subscription-Key": API_KEY } })
    .then(res => res.json())
    .then(data => {
      console.log("Matches:", data);
      return data;
    })
    .catch(err => {
      console.error("Error fetching matches:", err);
    });
}

// Fetch standings
function getStandings(season) {
  const url = `${BASE_URL}/scores/json/Standings/${season}`;
  
  fetch(url, { headers: { "Ocp-Apim-Subscription-Key": API_KEY } })
    .then(res => res.json())
    .then(data => {
      console.log("Standings:", data);
      return data;
    })
    .catch(err => {
      console.error("Error fetching standings:", err);
    });
}

// Example: Get random match info (if you have a button)
if (getMatch) {
  getMatch.addEventListener("click", () => {
    matchInfo.textContent = "Loading...";
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    const url = `${BASE_URL}/scores/json/GamesByDate/${today}`;
    
    fetch(url, { headers: { "Ocp-Apim-Subscription-Key": API_KEY } })
      .then(res => res.json())
      .then(data => {
        const matches = data;
        if (!matches.length) {
          matchInfo.textContent = "No matches found for today.";
          return;
        }
        
        // Pick a random match
        const randomIndex = Math.floor(Math.random() * matches.length);
        const match = matches[randomIndex];
        
        // Display match info
        matchInfo.textContent = `${match.HomeTeamName} vs ${match.AwayTeamName} - ${match.DateTime}`;
      })
      .catch(err => {
        console.error("Error fetching match:", err);
        matchInfo.textContent = "Error fetching random match.";
      });
  });
}