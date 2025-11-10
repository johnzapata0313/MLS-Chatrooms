# MLS Fan Hub Chatroom

A web application that creates dedicated chatrooms for each Major League Soccer (MLS) club, allowing fans to connect, share messages, and engage with their team's community.This is a full-stack CRUD (Create, Read, Update, Delete) application that provides 30 individual chatrooms—one for each MLS team. Fans can post messages, react with thumbs up/down, and participate in team-specific discussions to be a part of their respected communities. This project is the start for my demo day project. 

![46AD5CF9-79E1-4D10-9F28-D8FDAFEEA8B0](https://github.com/user-attachments/assets/ed3bd923-cbec-4913-8bd3-2f7a9b3926aa)

[Check out the magic](https://mls-chatrooms.onrender.com/)
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

##  Features

- **30 individual Chatrooms** - One for each MLS club with custom branding
- **Message Posting** - Fans can post messages to their team's room
- **Thumb System** - Thumbs up/down reactions on messages
- **Delete** - Remove unwanted messages
- **Responsive Design** - Each room styled with team colors and logos
- **Real-time Updates** - Messages display with timestamps

##  Lessons Learned

During deployment, the primary challenge was establishing proper database connection timing—the Express server was starting before MongoDB connected, causing route failures. This was resolved by nesting the server startup inside the MongoDB connection callback. Additional deployment hurdles included configuring environment variables for dynamic port assignment (process.env.PORT), properly converting string IDs to MongoDB ObjectId format for update/delete operations, and understanding Express static file serving where the public folder maps to root URL paths. The project also involved setting up GitHub-to-Render auto-deployment, distinguishing between MongoDB driver warnings versus critical errors, and implementing full CRUD functionality using MongoDB methods (insertOne, find().toArray(), findOneAndUpdate, findOneAndDelete).
##  Key Takeaways

- **Server-side rendering** with EJS provides a straightforward way to build dynamic web applications
- **Proper error handling** and connection management are critical for production deployments
- **Environment variables** make applications portable across different hosting environments
- **Git workflow** and continuous deployment streamline the development process
- **Database design** affects how easily you can query and display data
- **User experience** benefits from team-specific theming and visual feedback
