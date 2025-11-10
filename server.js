const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const {ObjectId} = require('mongodb')

var db, collection;

const url = "mongodb+srv://demo:demo@cluster0.q2ojb.mongodb.net/mlsfanhub?retryWrites=true&w=majority";
const dbName = "mlsfanhub"; 

// MLS Clubs data
const mlsClubs = [
{ id: 'atlanta-united', name: 'Atlanta United FC', color: '#80000B', logo: '/img/Logos/Atlanta_MLS.svg.png' },
  { id: 'austin-fc', name: 'Austin FC', color: '#00B140', logo: '/img/Logos/Austin_FC_logo.svg.png' },
  { id: 'charlotte-fc', name: 'Charlotte FC', color: '#00B2E3', logo: '/img/Logos/Charlotte_FC_logo.svg.png' },
  { id: 'chicago-fire', name: 'Chicago Fire FC', color: '#C8102E', logo: '/img/Logos/Chicago_Fire_logo,_2021.svg.png' },
  { id: 'fc-cincinnati', name: 'FC Cincinnati', color: '#FE5000', logo: '/img/Logos/FC_Cincinnati_primary_logo_2018.svg.png' },
  { id: 'colorado-rapids', name: 'Colorado Rapids', color: '#862633', logo: '/img/Logos/Colorado_Rapids_logo.svg.png' },
  { id: 'columbus-crew', name: 'Columbus Crew', color: '#FFF200', logo: '/img/Logos/Columbus_Crew_logo_2021.svg.png' },
  { id: 'dc-united', name: 'D.C. United', color: '#EF3E42', logo: '/img/Logos/D.C._United_logo_(2016).svg.png' },
  { id: 'fc-dallas', name: 'FC Dallas', color: '#BF0D3E', logo: '/img/Logos/FC_Dallas_logo.svg.png' },
  { id: 'houston-dynamo', name: 'Houston Dynamo FC', color: '#F68712', logo: '/img/Logos/Houston_Dynamo_FC_logo.svg.png' },
  { id: 'inter-miami', name: 'Inter Miami CF', color: '#F7B5CD', logo: '/img/Logos/Inter_Miami_CF_logo.svg.png' },
  { id: 'la-galaxy', name: 'LA Galaxy', color: '#00245D', logo: '/img/Logos/Los_Angeles_Galaxy_logo.svg.png' },
  { id: 'lafc', name: 'Los Angeles FC', color: '#C39E6D', logo: '/img/Logos/Los_Angeles_Football_Club.svg.png' },
  { id: 'minnesota-united', name: 'Minnesota United FC', color: '#8CD2F4', logo: '/img/Logos/Minnesota_United_FC_(MLS)_Primary_logo.svg.png' },
  { id: 'cf-montreal', name: 'CF Montréal', color: '#00529B', logo: '/img/Logos/CF_Montreal_logo_2023.svg.png' },
  { id: 'nashville-sc', name: 'Nashville SC', color: '#EDE939', logo: '/img/Logos/Nashville_SC_logo,_2020.svg.png' },
  { id: 'new-england', name: 'New England Revolution', color: '#C8102E', logo: '/img/Logos/New_England_Revolution_(2021)_logo.svg.png' },
  { id: 'nycfc', name: 'New York City FC', color: '#6CACE4', logo: '/img/Logos/Logo_New_York_City_FC_2025.svg.png' },
  { id: 'ny-red-bulls', name: 'New York Red Bulls', color: '#ED1E36', logo: '/img/Logos/New_York_Red_Bulls_logo.svg.png' },
  { id: 'orlando-city', name: 'Orlando City SC', color: '#612B9B', logo: '/img/Logos/Orlando_City_2014.svg.png' },
  { id: 'philadelphia-union', name: 'Philadelphia Union', color: '#B1872D', logo: '/img/Logos/Philadelphia_Union_2018_logo.svg.png' },
  { id: 'portland-timbers', name: 'Portland Timbers', color: '#004812', logo: '/img/Logos/Portland_Timbers_logo.svg.png' },
  { id: 'real-salt-lake', name: 'Real Salt Lake', color: '#B30838', logo: '/img/Logos/Real_Salt_Lake_2010.svg.png' },
  { id: 'san-diego-fc', name: 'San Diego FC', color: '#000000', logo: '/img/Logos/San_Diego_FC_logo.svg.png' },
  { id: 'san-jose', name: 'San Jose Earthquakes', color: '#0051BA', logo: '/img/Logos/San_Jose_Earthquakes_2014.svg.png' },
  { id: 'seattle-sounders', name: 'Seattle Sounders FC', color: '#5D9741', logo: '/img/Logos/Seattle_Sounders_logo.svg.png' },
  { id: 'sporting-kc', name: 'Sporting Kansas City', color: '#93B1D7', logo: '/img/Logos/Sporting_Kansas_City_logo.svg.png' },
  { id: 'st-louis-city', name: 'St. Louis City SC', color: '#5DBCD2', logo: '/img/Logos/St._Louis_City_SC_logo.svg.png' },
  { id: 'toronto-fc', name: 'Toronto FC', color: '#B81137', logo: '/img/Logos/Toronto_FC_Logo.svg.png' },
  { id: 'vancouver-whitecaps', name: 'Vancouver Whitecaps FC', color: '#9DC2EA', logo: '/img/Logos/Vancouver_Whitecaps_logo.svg.png' },
];

// Middleware
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

// CONNECT TO DATABASE FIRST, THEN START SERVER
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if(error) {
        throw error;
    }
    db = client.db(dbName);
    console.log("Connected to `" + dbName + "`!");
    
    // START SERVER AFTER DB CONNECTION - Use Render's PORT or default to 1997
    const PORT = process.env.PORT || 1997;
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
});

// Homepage - List all clubs
app.get('/', (req, res) => {
  res.render('index.ejs', {clubs: mlsClubs})
})

// Individual club page
app.get('/club/:clubId', (req, res) => {
  const clubId = req.params.clubId;
  const club = mlsClubs.find(c => c.id === clubId);
  
  if (!club) {
    return res.status(404).send('Club not found');
  }
  
  db.collection('messages').find({club: clubId}).sort({timestamp: -1}).toArray((err, result) => {
    if (err) return console.log(err)
    res.render('club.ejs', {
      club: club,
      messages: result
    })
  })
})

// Post message to specific club room
app.post('/club/:clubId/messages', (req, res) => {
  const clubId = req.params.clubId;
  
  db.collection('messages').insertOne({
    club: clubId,
    name: req.body.name, 
    msg: req.body.msg, 
    thumbUp: 0, 
    thumbDown: 0,
    timestamp: new Date()
  }, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/club/' + clubId)
  })
})

// Thumb up
app.put('/messages/thumbUp', (req, res) => {
  db.collection('messages')
  .findOneAndUpdate({_id: new ObjectId(req.body.id)}, {
    $inc: {
      thumbUp: 1
    }
  }, {
    sort: {_id: -1},
    upsert: false
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

// Thumb down
app.put('/messages/thumbDown', (req, res) => {
  db.collection('messages')
  .findOneAndUpdate({_id: new ObjectId(req.body.id)}, {
    $inc: {
      thumbDown: 1
    }
  }, {
    sort: {_id: -1},
    upsert: false
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

// Delete message
app.delete('/messages', (req, res) => {
  db.collection('messages').findOneAndDelete({_id: new ObjectId(req.body.id)}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})