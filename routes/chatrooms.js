const express = require("express");
const router = express.Router();
const Team = require("../models/Team");
const Message = require("../models/message");
const Comment = require("../models/comment");
const { ensureAuth } = require("../middleware/auth");
const upload = require('../middleware/multer');

// ========== VIEW ROUTES (Render Pages) ==========

// View specific chatroom
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.redirect("/main");
    }
    
    // Fetch messages for this team
    const messages = await Message.find({ chatroom: req.params.id })
      .populate("user", "userName image")
    //   .populate("comments.user", "userName image")
      .sort({ createdAt: 1 });

      console.log("Messages found:", messages.length); // ADD THIS
console.log("First message:", messages[0]); // ADD THIS
    
    res.render("chatroom", {
      team: team, 
      messages: messages,
      user: req.user 
    });
  } catch (err) {
    console.log("ERROR IN GET ROUTE:", err); // CHANGE THIS LINE
    console.log("Full error:", err.message);
    res.redirect("/main");
  }
});

// ========== API ROUTES (For AJAX/Fetch Requests) ==========

// Post a new message (with optional photo)
router.post("/:id/messages", ensureAuth, upload.single("photo"), async (req, res) => {
  try {
     console.log("Form data received:", req.body);
     console.log("File received:", req.file);

    const messageData = {
      chatroom: req.params.id,
      user: req.user.id,
      username: req.user.userName,
      content: req.body.message
    };

    // If photo was uploaded
    if (req.file) {
      messageData.photo = {
        url: req.file.path,
        publicId: req.file.filename,
        filename: req.file.originalname
      };
    }

    const message = await Message.create(messageData);
    const populatedMessage = await Message.findById(message._id)
      .populate("user", "userName image");
    
    res.status(201).json(populatedMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get messages (for real-time updates/AJAX)
router.get("/:id/messages/api", ensureAuth, async (req, res) => {
  try {
    const messages = await Message.find({ chatroom: req.params.id })
      .populate("user", "userName image")
      .populate("comments.user", "userName image")
      .sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Toggle thumbs up on a message
router.put("/:id/messages/:messageId/thumbs-up", ensureAuth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    const userIndex = message.thumbsUp.indexOf(req.user.id);
    
    if (userIndex > -1) {
      // Remove thumbs up
      message.thumbsUp.splice(userIndex, 1);
    } else {
      // Add thumbs up and remove thumbs down if exists
      message.thumbsUp.push(req.user.id);
      const downIndex = message.thumbsDown.indexOf(req.user.id);
      if (downIndex > -1) {
        message.thumbsDown.splice(downIndex, 1);
      }
    }

    await message.save();
    res.json({
      thumbsUpCount: message.thumbsUp.length,
      thumbsDownCount: message.thumbsDown.length,
      userThumbsUp: message.thumbsUp.includes(req.user.id),
      userThumbsDown: message.thumbsDown.includes(req.user.id)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Toggle thumbs down on a message
router.put("/:id/messages/:messageId/thumbs-down", ensureAuth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    const userIndex = message.thumbsDown.indexOf(req.user.id);
    
    if (userIndex > -1) {
      // Remove thumbs down
      message.thumbsDown.splice(userIndex, 1);
    } else {
      // Add thumbs down and remove thumbs up if exists
      message.thumbsDown.push(req.user.id);
      const upIndex = message.thumbsUp.indexOf(req.user.id);
      if (upIndex > -1) {
        message.thumbsUp.splice(upIndex, 1);
      }
    }

    await message.save();
    res.json({
      thumbsUpCount: message.thumbsUp.length,
      thumbsDownCount: message.thumbsDown.length,
      userThumbsUp: message.thumbsUp.includes(req.user.id),
      userThumbsDown: message.thumbsDown.includes(req.user.id)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add a comment to a message (with optional photo)
router.post("/:id/messages/:messageId/comments", ensureAuth, async (req, res) => {
  upload.single("photo")(req, res, async (err) => {
    try {
      console.log("=== COMMENT DEBUG ===");
      console.log("req.body:", req.body);
      console.log("req.body.comment:", req.body.comment);
      console.log("req.file:", req.file);
      console.log("===================");
      
      const message = await Message.findById(req.params.messageId);
      
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }

      const commentData = {
        text: req.body.comment,  // Changed from 'comment' to 'text'
        user: req.user.id,
        username: req.user.userName,  // Add username
        createdAt: new Date()
      };

      if (req.file) {
        commentData.photo = {
          url: req.file.path,
          publicId: req.file.filename,
          filename: req.file.originalname
        };
      }

      // Add comment to the message's comments array
      message.comments.push(commentData);
      await message.save();
      
      res.status(201).json(message);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });
});

// Delete a comment
router.delete("/:id/messages/:messageId/comments/:commentId", ensureAuth, async (req, res) => {
  try {
     console.log("=== COMMENT DEBUG ===");
    console.log("req.body:", req.body);
    console.log("req.body.comment:", req.body.comment);
    console.log("req.file:", req.file);
    console.log("===================");

    const message = await Message.findById(req.params.messageId);
    
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    const comment = message.comments.id(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if user owns the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    comment.deleteOne();
    await message.save();
    
    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
// const express = require("express");
// const router = express.Router();
// const Team = require("../models/Team");
// const { ensureAuth } = require("../middleware/auth");

// // View specific chatroom
// router.get("/:id", ensureAuth, async (req, res) => {
//   try {
//     const team = await Team.findById(req.params.id);
//     if (!team) {
//       return res.redirect("/main");
//     }
//     // Fetch messages for this team (you'll need a Message model)
//     res.render("club", { 
//       club: team, 
//       messages: [], // Empty for now until we set up messages
//       user: req.user 
//     });
//   } catch (err) {
//     console.log(err);
//     res.redirect("/main");
//   }
// });

// // Add your chatroom routes here later

// module.exports = router;