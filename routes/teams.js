const express = require("express");
const router = express.Router();
const Team = require("../models/Team");

// @desc    Setup/add all MLS teams (run once)
// @route   GET /teams/setup
router.get("/setup", async (req, res) => {
  try {
    await Team.deleteMany({});
    
    // YOUR MLS clubs data (converted to match Team schema)
    const mlsTeams = [
      {
        name: "Atlanta United FC",
        city: "Atlanta",
        state: "Georgia",
        stadium: "Mercedes-Benz Stadium",
        founded: 2014,
        colors: ["Red", "Black", "Gold"],
        logo: "/img/Logos/Atlanta_MLS.svg.png"
      },
      {
        name: "Austin FC",
        city: "Austin",
        state: "Texas",
        stadium: "Q2 Stadium",
        founded: 2018,
        colors: ["Verde", "Black"],
        logo: "/img/Logos/Austin_FC_logo.svg.png"
      },
      {
        name: "Charlotte FC",
        city: "Charlotte",
        state: "North Carolina",
        stadium: "Bank of America Stadium",
        founded: 2019,
        colors: ["Blue", "Black", "White"],
        logo: "/img/Logos/Charlotte_FC_logo.svg.png"
      },
      {
        name: "Chicago Fire FC",
        city: "Chicago",
        state: "Illinois",
        stadium: "Soldier Field",
        founded: 1997,
        colors: ["Red", "White", "Blue"],
        logo: "/img/Logos/Chicago_Fire_logo,_2021.svg.png"
      },
      {
        name: "FC Cincinnati",
        city: "Cincinnati",
        state: "Ohio",
        stadium: "TQL Stadium",
        founded: 2015,
        colors: ["Orange", "Blue"],
        logo: "/img/Logos/FC_Cincinnati_primary_logo_2018.svg.png"
      },
      {
        name: "Colorado Rapids",
        city: "Commerce City",
        state: "Colorado",
        stadium: "Dick's Sporting Goods Park",
        founded: 1995,
        colors: ["Burgundy", "Sky Blue"],
        logo: "/img/Logos/Colorado_Rapids_logo.svg.png"
      },
      {
        name: "Columbus Crew",
        city: "Columbus",
        state: "Ohio",
        stadium: "Lower.com Field",
        founded: 1994,
        colors: ["Black", "Gold"],
        logo: "/img/Logos/Columbus_Crew_logo_2021.svg.png"
      },
      {
        name: "D.C. United",
        city: "Washington",
        state: "District of Columbia",
        stadium: "Audi Field",
        founded: 1995,
        colors: ["Black", "Red"],
        logo: "/img/Logos/D.C._United_logo_(2016).svg.png"
      },
      {
        name: "FC Dallas",
        city: "Frisco",
        state: "Texas",
        stadium: "Toyota Stadium",
        founded: 1995,
        colors: ["Red", "Blue"],
        logo: "/img/Logos/FC_Dallas_logo.svg.png"
      },
      {
        name: "Houston Dynamo FC",
        city: "Houston",
        state: "Texas",
        stadium: "Shell Energy Stadium",
        founded: 2005,
        colors: ["Orange", "Black"],
        logo: "/img/Logos/Houston_Dynamo_FC_logo.svg.png"
      },
      {
        name: "Inter Miami CF",
        city: "Fort Lauderdale",
        state: "Florida",
        stadium: "Chase Stadium",
        founded: 2018,
        colors: ["Pink", "Black"],
        logo: "/img/Logos/Inter_Miami_CF_logo.svg.png"
      },
      {
        name: "LA Galaxy",
        city: "Los Angeles",
        state: "California",
        stadium: "Dignity Health Sports Park",
        founded: 1995,
        colors: ["Navy Blue", "Gold", "White"],
        logo: "/img/Logos/Los_Angeles_Galaxy_logo.svg.png"
      },
      {
        name: "Los Angeles FC",
        city: "Los Angeles",
        state: "California",
        stadium: "BMO Stadium",
        founded: 2014,
        colors: ["Black", "Gold"],
        logo: "/img/Logos/Los_Angeles_Football_Club.svg.png"
      },
      {
        name: "Minnesota United FC",
        city: "Saint Paul",
        state: "Minnesota",
        stadium: "Allianz Field",
        founded: 2015,
        colors: ["Blue", "Gray", "Black"],
        logo: "/img/Logos/Minnesota_United_FC_(MLS)_Primary_logo.svg.png"
      },
      {
        name: "CF Montréal",
        city: "Montreal",
        state: "Quebec",
        stadium: "Stade Saputo",
        founded: 1992,
        colors: ["Blue", "Black"],
        logo: "/img/Logos/CF_Montreal_logo_2023.svg.png"
      },
      {
        name: "Nashville SC",
        city: "Nashville",
        state: "Tennessee",
        stadium: "GEODIS Park",
        founded: 2016,
        colors: ["Navy", "Gold"],
        logo: "/img/Logos/Nashville_SC_logo,_2020.svg.png"
      },
      {
        name: "New England Revolution",
        city: "Foxborough",
        state: "Massachusetts",
        stadium: "Gillette Stadium",
        founded: 1995,
        colors: ["Navy", "Red", "White"],
        logo: "/img/Logos/New_England_Revolution_(2021)_logo.svg.png"
      },
      {
        name: "New York City FC",
        city: "New York",
        state: "New York",
        stadium: "Yankee Stadium",
        founded: 2013,
        colors: ["Sky Blue", "Navy"],
        logo: "/img/Logos/Logo_New_York_City_FC_2025.svg.png"
      },
      {
        name: "New York Red Bulls",
        city: "Harrison",
        state: "New Jersey",
        stadium: "Red Bull Arena",
        founded: 1995,
        colors: ["Red", "White", "Yellow"],
        logo: "/img/Logos/New_York_Red_Bulls_logo.svg.png"
      },
      {
        name: "Orlando City SC",
        city: "Orlando",
        state: "Florida",
        stadium: "Inter&Co Stadium",
        founded: 2013,
        colors: ["Purple", "Gold"],
        logo: "/img/Logos/Orlando_City_2014.svg.png"
      },
      {
        name: "Philadelphia Union",
        city: "Chester",
        state: "Pennsylvania",
        stadium: "Subaru Park",
        founded: 2008,
        colors: ["Navy", "Gold"],
        logo: "/img/Logos/Philadelphia_Union_2018_logo.svg.png"
      },
      {
        name: "Portland Timbers",
        city: "Portland",
        state: "Oregon",
        stadium: "Providence Park",
        founded: 2009,
        colors: ["Green", "Gold"],
        logo: "/img/Logos/Portland_Timbers_logo.svg.png"
      },
      {
        name: "Real Salt Lake",
        city: "Sandy",
        state: "Utah",
        stadium: "America First Field",
        founded: 2004,
        colors: ["Red", "Cobalt", "Gold"],
        logo: "/img/Logos/Real_Salt_Lake_2010.svg.png"
      },
      {
        name: "San Diego FC",
        city: "San Diego",
        state: "California",
        stadium: "Snapdragon Stadium",
        founded: 2023,
        colors: ["Black"],
        logo: "/img/Logos/San_Diego_FC_logo.svg.png"
      },
      {
        name: "San Jose Earthquakes",
        city: "San Jose",
        state: "California",
        stadium: "PayPal Park",
        founded: 1994,
        colors: ["Blue", "Black"],
        logo: "/img/Logos/San_Jose_Earthquakes_2014.svg.png"
      },
      {
        name: "Seattle Sounders FC",
        city: "Seattle",
        state: "Washington",
        stadium: "Lumen Field",
        founded: 2007,
        colors: ["Rave Green", "Blue"],
        logo: "/img/Logos/Seattle_Sounders_logo.svg.png"
      },
      {
        name: "Sporting Kansas City",
        city: "Kansas City",
        state: "Kansas",
        stadium: "Children's Mercy Park",
        founded: 1995,
        colors: ["Blue", "Navy"],
        logo: "/img/Logos/Sporting_Kansas_City_logo.svg.png"
      },
      {
        name: "St. Louis City SC",
        city: "St. Louis",
        state: "Missouri",
        stadium: "CityPark",
        founded: 2019,
        colors: ["Red", "Navy", "Light Blue"],
        logo: "/img/Logos/St._Louis_City_SC_logo.svg.png"
      },
      {
        name: "Toronto FC",
        city: "Toronto",
        state: "Ontario",
        stadium: "BMO Field",
        founded: 2005,
        colors: ["Red", "Gray"],
        logo: "/img/Logos/Toronto_FC_Logo.svg.png"
      },
      {
        name: "Vancouver Whitecaps FC",
        city: "Vancouver",
        state: "British Columbia",
        stadium: "BC Place",
        founded: 2009,
        colors: ["Blue", "White"],
        logo: "/img/Logos/Vancouver_Whitecaps_logo.svg.png"
      }
    ];
    
    const teams = await Team.insertMany(mlsTeams);
    res.send(`✅ Successfully added ${teams.length} MLS teams!`);
  } catch (err) {
    res.send('Error: ' + err);
  }
});

// @desc    Get all teams
// @route   GET /teams
router.get("/", async (req, res) => {
  try {
    const teams = await Team.find({}).sort({ name: 1 });
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;