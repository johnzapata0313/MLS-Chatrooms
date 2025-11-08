# MLS Fan Hub Chatroom

A web application that creates dedicated chatrooms for each Major League Soccer (MLS) club, allowing fans to connect, share messages, and engage with their team's community.This is a full-stack CRUD (Create, Read, Update, Delete) application that provides 30 individual chatrooms—one for each MLS team. Fans can post messages, react with thumbs up/down, and participate in team-specific discussions to be a part of their respected communities. This project is the start for my demo day project. 

![46AD5CF9-79E1-4D10-9F28-D8FDAFEEA8B0](https://github.com/user-attachments/assets/ed3bd923-cbec-4913-8bd3-2f7a9b3926aa)

##  Technologies Used

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework for routing and middleware
- **MongoDB** - NoSQL database for storing messages and user interactions
- **Body-Parser** - Middleware for parsing incoming request bodies

### Frontend
- **EJS (Embedded JavaScript)** - Templating engine for dynamic HTML rendering
- **HTML/CSS** - Structure and styling
- **JavaScript** - Client-side interactivity

### Deployment
- **Render** - Cloud platform for hosting the application
- **GitHub** - Version control and continuous deployment

## ✨ Features

- **30 individual Chatrooms** - One for each MLS club with custom branding
- **Message Posting** - Fans can post messages to their team's room
- **Thumb System** - Thumbs up/down reactions on messages
- **Delete** - Remove unwanted messages
- **Responsive Design** - Each room styled with team colors and logos
- **Real-time Updates** - Messages display with timestamps

##  Lessons Learned

### 1. **Database Connection Timing**
**Challenge:** Initial deployment failed because routes tried to access the database before the connection was established.

**Solution:** Restructured code to start the Express server only after MongoDB connection succeeds:
```javascript
MongoClient.connect(url, (error, client) => {
    if(error) throw error;
    db = client.db(dbName);
    
    app.listen(PORT, () => {
        console.log('Server running');
    });
});
```

### 2. **Environment-Specific Configuration**
**Challenge:** Hardcoded port numbers caused deployment failures on Render.

**Solution:** Used environment variables for flexible deployment:
```javascript
const PORT = process.env.PORT || 1997;
```

### 3. **MongoDB ObjectId Conversion**
**Challenge:** Update and delete operations failed because string IDs weren't properly converted.

**Solution:** Imported and used `ObjectId` from MongoDB:
```javascript
const {ObjectId} = require('mongodb');
db.collection('messages').findOneAndDelete({_id: new ObjectId(req.body.id)})
```

### 4. **Static File Serving**
**Challenge:** Understanding how Express serves static assets and proper folder structure.

**Solution:** Learned that `app.use(express.static('public'))` maps the `public` folder to the root URL path, so `/img/logos/logo.png` serves from `public/img/logos/logo.png`.

### 5. **Deployment Process**
**Challenge:** Understanding the GitHub → Render deployment pipeline.

**Solution:** Configured auto-deployment from GitHub, ensuring all assets (including images) are committed to the repository.

### 6. **Version Compatibility**
**Challenge:** MongoDB driver warnings about deprecated methods.

**Solution:** Learned to distinguish between warnings (non-breaking) and errors (breaking), and made informed decisions about when to update dependencies in legacy codebases.

### 7. **CRUD Operations**
**Challenge:** Implementing full Create, Read, Update, Delete functionality with MongoDB.

**Solution:** Mastered MongoDB methods:
- `insertOne()` - Create messages
- `find().toArray()` - Read messages
- `findOneAndUpdate()` - Update votes
- `findOneAndDelete()` - Delete messages

##  Key Takeaways

- **Server-side rendering** with EJS provides a straightforward way to build dynamic web applications
- **Proper error handling** and connection management are critical for production deployments
- **Environment variables** make applications portable across different hosting environments
- **Git workflow** and continuous deployment streamline the development process
- **Database design** affects how easily you can query and display data
- **User experience** benefits from team-specific theming and visual feedback
