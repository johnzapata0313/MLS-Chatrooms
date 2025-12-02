const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");
const mainRoutes = require("./routes/main");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");
const teamRoutes = require("./routes/teams");
const authRoutes = require("./routes/auth");
const chatroomRoutes = require("./routes/chatrooms");
const bettingRoutes = require("./routes/betting");

// Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

// Connect to Database
connectDB();

// View engine setup
app.set("view engine", "ejs");

// Body Parsing Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Logging Middleware
app.use(logger("dev"));

// Method Override for PUT and DELETE
app.use(methodOverride("_method"));

// Static Folder
app.use(express.static("public"));
app.use('/betting', express.static("betting"));

// Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Setup Routes
app.use("/", authRoutes);
app.use("/", mainRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);
app.use("/teams", teamRoutes);
app.use("/chatroom", chatroomRoutes);
app.use("/api/betting", bettingRoutes);

// Static folder AFTER routes
app.use('/betting', express.static("betting"));

// Start Server
const PORT = process.env.PORT || 1997;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}, you better catch it!`);
});