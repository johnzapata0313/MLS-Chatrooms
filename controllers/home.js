const Team = require("../models/Team");

module.exports = {
  getIndex: async (req, res) => {
    try {
      const clubs = await Team.find({}).sort({ name: 1 });
      res.render("index.ejs", { clubs: clubs });
    } catch (err) {
      console.log(err);
      res.render("index.ejs", { clubs: [] });
    }
  },
};