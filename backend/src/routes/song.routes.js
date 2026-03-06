const express = require('express');
const songRouter = express.Router();
const upload = require('../middleware/upload.middleware');
const songController = require("../controller/song.controller")


songRouter.post("/", upload.fields([{ name: "song", maxCount: 1 }, { name: "poster", maxCount: 1 }]), songController.uploadSongs)
songRouter.get("/", songController.getRandomMoodSong)
songRouter.get("/mood-songs", songController.getMoodSongs)
songRouter.get("/all-songs", songController.getSongs)
songRouter.get("/search-songs", songController.searchSongs)




module.exports = songRouter;