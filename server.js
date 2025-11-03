const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://demo:demo@cluster0-q2ojb.mongodb.net/test?retryWrites=true";
const dbName = "mlsfanhub"; // New database name

// MLS Clubs data
const mlsClubs = [
  { id: 'atlanta-united', name: 'Atlanta United FC', color: '#80000B' },
  { id: 'austin-fc', name: 'Austin FC', color: '#00B140' },
  { id: 'charlotte-fc', name: 'Charlotte FC', color: '#00B2E3' },
  { id: 'chicago-fire', name: 'Chicago Fire FC', color: '#C8102E' },
  { id: 'fc-cincinnati', name: 'FC Cincinnati', color: '#FE5000' },
  { id: 'colorado-rapids', name: 'Colorado Rapids', color: '#862633' },
  { id: 'columbus-crew', name: 'Columbus Crew', color: '#FFF200' },
  { id: 'dc-united', name: 'D.C. United', color: '#EF3E42' },
  { id: 'fc-dallas', name: 'FC Dallas', color: '#BF0D3E' },
  { id: 'houston-dynamo', name: 'Houston Dynamo FC', color: '#F68712' },
  { id: 'inter-miami', name: 'Inter Miami CF', color: '#F7B5CD' },
  { id: 'la-galaxy', name: 'LA Galaxy', color: '#00245D' },
  { id: 'lafc', name: 'Los Angeles FC', color: '#C39E6D' },
  { id: 'minnesota-united', name: 'Minnesota United FC', color: '#8CD2F4' },
  { id: 'cf-montreal', name: 'CF Montréal', color: '#00529B' },
  { id: 'nashville-sc', name: 'Nashville SC', color: '#EDE939' },
  { id: 'new-england', name: 'New England Revolution', color: '#C8102E' },
  { id: 'nycfc', name: 'New York City FC', color: '#6CACE4' },
  { id: 'ny-red-bulls', name: 'New York Red Bulls', color: '#ED1E36' },
  { id: 'orlando-city', name: 'Orlando City SC', color: '#612B9B' },
  { id: 'philadelphia-union', name: 'Philadelphia Union', color: '#B1872D' },
  { id: 'portland-timbers', name: 'Portland Timbers', color: '#004812' },
  { id: 'real-salt-lake', name: 'Real Salt Lake', color: '#B30838' },
  { id: 'san-jose', name: 'San Jose Earthquakes', color: '#0051BA' },
  { id: 'seattle-sounders', name: 'Seattle Sounders FC', color: '#5D9741' },
  { id: 'sporting-kc', name: 'Sporting Kansas City', color: '#93B1D7' },
  { id: 'st-louis-city', name: 'St. Louis City SC', color: '#5DBCD2' },
  { id: 'toronto-fc', name: 'Toronto FC', color: '#B81137' },
  { id: 'vancouver-whitecaps', name: 'Vancouver Whitecaps FC', color: '#9DC2EA' },
  { id: 'san-diego-fc', name: 'San Diego FC', color: '#000000' }
];

app.listen(1933, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

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

// Post message to specific club
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
  .findOneAndUpdate({_id: req.body.id}, {
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
  .findOneAndUpdate({_id: req.body.id}, {
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
  db.collection('messages').findOneAndDelete({_id: req.body.id}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})