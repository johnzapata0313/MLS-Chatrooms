const express = require("express");
const router = express.Router();

const BASE_URL = "https://app.americansocceranalysis.com/api/v1";

// TEST ROUTE
router.get("/test", (req, res) => {
  res.json({ message: "Betting route is working!" });
});

// Get teams
router.get("/teams", async (req, res) => {
  try {
    const url = `${BASE_URL}/teams`;
    console.log("=== FETCHING TEAMS ===");
    console.log("URL:", url);
    
    const response = await fetch(url);
    
    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log("Response body (first 500 chars):", responseText.substring(0, 500));
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: "API request failed", 
        status: response.status,
        body: responseText 
      });
    }
    
    const data = JSON.parse(responseText);
    console.log("Parsed data type:", Array.isArray(data) ? 'array' : typeof data);
    console.log("Data length/keys:", Array.isArray(data) ? data.length : Object.keys(data));
    
    res.json(data);
  } catch (error) {
    console.error("=== ERROR ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Full error:", error);
    res.status(500).json({ error: "Failed to fetch teams", details: error.message });
  }
});

// Get games
router.get("/games", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/games?season_name=2024`);
    
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      return res.status(response.status).json({ error: "API request failed" });
    }
    
    const data = await response.json();
    console.log("Games data received:", Array.isArray(data), data.length || 'not an array');
    res.json(data);
  } catch (error) {
    console.error("Error fetching games:", error.message);
    res.status(500).json({ error: "Failed to fetch games", details: error.message });
  }
});

// Get players
router.get("/players", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/players/xgoals?season_name=2024&minimum_minutes=400`);
    
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      return res.status(response.status).json({ error: "API request failed" });
    }
    
    const data = await response.json();
    console.log("Players data received:", Array.isArray(data), data.length || 'not an array');
    res.json(data);
  } catch (error) {
    console.error("Error fetching players:", error.message);
    res.status(500).json({ error: "Failed to fetch players", details: error.message });
  }
});

module.exports = router;