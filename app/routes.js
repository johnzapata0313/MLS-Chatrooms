module.exports = function(app, passport, db) {

// MLS TEAM ROUTES ===============================================================
var Team = require('./models/team');

// Route to setup/add all MLS teams to database (run this once)
app.get('/setup-teams', (req, res) => {
  Team.deleteMany({}, (err) => {
    if (err) return res.send('Error clearing teams: ' + err);
    
    var mlsTeams = [
      {
        name: "Atlanta United FC",
        city: "Atlanta",
        state: "Georgia",
        latitude: 33.7553,
        longitude: -84.4006,
        stadium: "Mercedes-Benz Stadium",
        founded: 2014,
        colors: ["Red", "Black", "Gold"]
      },
      {
        name: "Austin FC",
        city: "Austin",
        state: "Texas",
        latitude: 30.3883,
        longitude: -97.7197,
        stadium: "Q2 Stadium",
        founded: 2018,
        colors: ["Verde", "Black"]
      },
      {
        name: "Charlotte FC",
        city: "Charlotte",
        state: "North Carolina",
        latitude: 35.2251,
        longitude: -80.8531,
        stadium: "Bank of America Stadium",
        founded: 2019,
        colors: ["Blue", "Black", "White"]
      },
      {
        name: "Chicago Fire FC",
        city: "Chicago",
        state: "Illinois",
        latitude: 41.7649,
        longitude: -87.8072,
        stadium: "Soldier Field",
        founded: 1997,
        colors: ["Red", "White", "Blue"]
      },
      {
        name: "FC Cincinnati",
        city: "Cincinnati",
        state: "Ohio",
        latitude: 39.1108,
        longitude: -84.5203,
        stadium: "TQL Stadium",
        founded: 2015,
        colors: ["Orange", "Blue"]
      },
      {
        name: "Colorado Rapids",
        city: "Commerce City",
        state: "Colorado",
        latitude: 39.8054,
        longitude: -104.8919,
        stadium: "Dick's Sporting Goods Park",
        founded: 1995,
        colors: ["Burgundy", "Sky Blue"]
      },
      {
        name: "Columbus Crew",
        city: "Columbus",
        state: "Ohio",
        latitude: 39.9689,
        longitude: -83.0183,
        stadium: "Lower.com Field",
        founded: 1994,
        colors: ["Black", "Gold"]
      },
      {
        name: "D.C. United",
        city: "Washington",
        state: "District of Columbia",
        latitude: 38.8683,
        longitude: -77.0120,
        stadium: "Audi Field",
        founded: 1995,
        colors: ["Black", "Red"]
      },
      {
        name: "FC Dallas",
        city: "Frisco",
        state: "Texas",
        latitude: 33.1547,
        longitude: -96.8352,
        stadium: "Toyota Stadium",
        founded: 1995,
        colors: ["Red", "Blue"]
      },
      {
        name: "Houston Dynamo FC",
        city: "Houston",
        state: "Texas",
        latitude: 29.7520,
        longitude: -95.3517,
        stadium: "Shell Energy Stadium",
        founded: 2005,
        colors: ["Orange", "Black"]
      },
      {
        name: "Inter Miami CF",
        city: "Fort Lauderdale",
        state: "Florida",
        latitude: 26.1932,
        longitude: -80.1647,
        stadium: "Chase Stadium",
        founded: 2018,
        colors: ["Pink", "Black"]
      },
      {
        name: "LA Galaxy",
        city: "Los Angeles",
        state: "California",
        latitude: 33.8644,
        longitude: -118.2611,
        stadium: "Dignity Health Sports Park",
        founded: 1995,
        colors: ["Navy Blue", "Gold", "White"]
      },
      {
        name: "Los Angeles FC",
        city: "Los Angeles",
        state: "California",
        latitude: 34.0122,
        longitude: -118.2879,
        stadium: "BMO Stadium",
        founded: 2014,
        colors: ["Black", "Gold"]
      },
      {
        name: "Minnesota United FC",
        city: "Saint Paul",
        state: "Minnesota",
        latitude: 44.9529,
        longitude: -93.1650,
        stadium: "Allianz Field",
        founded: 2015,
        colors: ["Blue", "Gray", "Black"]
      },
      {
        name: "CF Montréal",
        city: "Montreal",
        state: "Quebec",
        latitude: 45.5629,
        longitude: -73.5529,
        stadium: "Stade Saputo",
        founded: 1992,
        colors: ["Blue", "Black"]
      },
      {
        name: "Nashville SC",
        city: "Nashville",
        state: "Tennessee",
        latitude: 36.1349,
        longitude: -86.7661,
        stadium: "GEODIS Park",
        founded: 2016,
        colors: ["Navy", "Gold"]
      },
      {
        name: "New England Revolution",
        city: "Foxborough",
        state: "Massachusetts",
        latitude: 42.0909,
        longitude: -71.2643,
        stadium: "Gillette Stadium",
        founded: 1995,
        colors: ["Navy", "Red", "White"]
      },
      {
        name: "New York City FC",
        city: "New York",
        state: "New York",
        latitude: 40.8296,
        longitude: -73.9262,
        stadium: "Yankee Stadium",
        founded: 2013,
        colors: ["Sky Blue", "Navy"]
      },
      {
        name: "New York Red Bulls",
        city: "Harrison",
        state: "New Jersey",
        latitude: 40.7369,
        longitude: -74.1502,
        stadium: "Red Bull Arena",
        founded: 1995,
        colors: ["Red", "White", "Yellow"]
      },
      {
        name: "Orlando City SC",
        city: "Orlando",
        state: "Florida",
        latitude: 28.5412,
        longitude: -81.3890,
        stadium: "Inter&Co Stadium",
        founded: 2013,
        colors: ["Purple", "Gold"]
      },
      {
        name: "Philadelphia Union",
        city: "Chester",
        state: "Pennsylvania",
        latitude: 39.8327,
        longitude: -75.3788,
        stadium: "Subaru Park",
        founded: 2008,
        colors: ["Navy", "Gold"]
      },
      {
        name: "Portland Timbers",
        city: "Portland",
        state: "Oregon",
        latitude: 45.5215,
        longitude: -122.6917,
        stadium: "Providence Park",
        founded: 2009,
        colors: ["Green", "Gold"]
      },
      {
        name: "Real Salt Lake",
        city: "Sandy",
        state: "Utah",
        latitude: 40.5830,
        longitude: -111.8933,
        stadium: "America First Field",
        founded: 2004,
        colors: ["Red", "Cobalt", "Gold"]
      },
      
      {
        name: "San Jose Earthquakes",
        city: "San Jose",
        state: "California",
        latitude: 37.3513,
        longitude: -121.9250,
        stadium: "PayPal Park",
        founded: 1994,
        colors: ["Blue", "Black"]
      },
      {
        name: "Seattle Sounders FC",
        city: "Seattle",
        state: "Washington",
        latitude: 47.5952,
        longitude: -122.3316,
        stadium: "Lumen Field",
        founded: 2007,
        colors: ["Rave Green", "Blue"]
      },
      {
        name: "Sporting Kansas City",
        city: "Kansas City",
        state: "Kansas",
        latitude: 39.1219,
        longitude: -94.8233,
        stadium: "Children's Mercy Park",
        founded: 1995,
        colors: ["Blue", "Navy"]
      },
      {
        name: "St. Louis City SC",
        city: "St. Louis",
        state: "Missouri",
        latitude: 38.6283,
        longitude: -90.2109,
        stadium: "CityPark",
        founded: 2019,
        colors: ["Red", "Navy", "Light Blue"]
      },
      {
        name: "Toronto FC",
        city: "Toronto",
        state: "Ontario",
        latitude: 43.6332,
        longitude: -79.4189,
        stadium: "BMO Field",
        founded: 2005,
        colors: ["Red", "Gray"]
      },
      {
        name: "Vancouver Whitecaps FC",
        city: "Vancouver",
        state: "British Columbia",
        latitude: 49.2767,
        longitude: -123.1119,
        stadium: "BC Place",
        founded: 2009,
        colors: ["Blue", "White"]
      }
    ];
    
    Team.insertMany(mlsTeams, (err, teams) => {
      if (err) return res.send('Error adding teams: ' + err);
      res.send('✅ Successfully added ' + teams.length + ' MLS teams to the database!');
    });
  });
});

// Route to view all teams
app.get('/teams', (req, res) => {
  Team.find({}, (err, teams) => {
    if (err) return res.send('Error: ' + err);
    res.json(teams);
  });
});

// Show the find team form
app.get('/find-team', (req, res) => {
  res.render('find-team.ejs');
});

// Process the form and find closest team
app.post('/find-my-team', (req, res) => {
  var userCity = req.body.city.trim();
  var userState = req.body.state.trim();
  
  console.log('User searching for:', userCity, userState); // Debug log
  
  Team.find({}, (err, teams) => {
    if (err) return res.send('Error: ' + err);
    
    if (teams.length === 0) {
      return res.send('No teams in database. Please run /setup-teams first.');
    }
    
    console.log('Total teams found:', teams.length); // Debug log
    
    // Find the closest team
    var closestTeam = null;
    var shortestDistance = Infinity;
    
    teams.forEach(function(team) {
      var distance = 1000; // Default: very far
      
      // Case-insensitive matching
      var teamState = team.state.toLowerCase();
      var teamCity = team.city.toLowerCase();
      var searchState = userState.toLowerCase();
      var searchCity = userCity.toLowerCase();
      
      // Same city = closest!
      if (teamCity === searchCity && teamState === searchState) {
        distance = 5;
      }
      // Same state = pretty close
      else if (teamState === searchState) {
        distance = 100;
      }
      // Different state = far
      else {
        distance = 500;
      }
      
      console.log(team.name + ': ' + distance + ' miles'); // Debug log
      
      if (distance < shortestDistance) {
        shortestDistance = distance;
        closestTeam = team;
      }
    });
    
    if (!closestTeam) {
      return res.send('Could not find a team. Please try again.');
    }
    
    console.log('Closest team:', closestTeam.name); // Debug log
    
    res.render('results.ejs', {
      team: closestTeam,
      distance: shortestDistance
    });
  });
});


// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
    db.collection('messages').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('find-team.ejs', {  // ← CHANGED THIS LINE
        user : req.user,
        messages: result
      })
    })
});

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================

    app.post('/zipcode', (req, res) => {
      db.collection('zipcode').save({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })

    app.put('/messages/thumbUp', (req, res) => {
  db.collection('messages')
  .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    $set: {
      thumbUp:req.body.thumbUp + 1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.put('/messages/thumbDown', (req, res) => {
  db.collection('messages')
  .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    $inc: {
      thumbDown: 1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

    app.delete('/messages', (req, res) => {
      db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}