const songModel = require('../models/song.model');
const id3 = require('node-id3');
const storageService = require("../services/storage.service")

async function uploadSongs(req, res) {
    const songBuffer = req.files.song[0].buffer
    const { mood } = req.body
    const tags = id3.read(songBuffer)
    const posterBuffer = req.files.poster?.[0].buffer || tags.image?.imageBuffer

    if (!posterBuffer) {
        return res.status(400).json({
            message: "Poster image is required (either embedded in song or uploaded separately)"
        })
    }

    const [songFile, postFile] = await Promise.all([
        storageService.uploadFile({
            buffer: songBuffer,
            filename: tags.title + ".mp3",
            folder: "/moodify/songs"
        }),
        storageService.uploadFile({
            buffer: posterBuffer,
            filename: tags.title + ".jpeg",
            folder: "/moodify/posters"
        })
    ])

    const song = await songModel.create({
        title: tags.title,
        url: songFile.url,
        posterUrl: postFile.url,
        mood
    })

    res.status(201).json({
        message: "Song uploaded successfully",
        song
    })
}

async function getRandomMoodSong(req, res) {
    const { mood } = req.query

    const song = await songModel.aggregate([
        { $match: { mood } },
        { $sample: { size: 1 } }
    ]);

    res.status(200).json({
        message: "Song fetched successfully",
        song
    })
}

async function getMoodSongs(req, res) {
    const { mood } = req.query

    const song = await songModel.find({ mood });

    res.status(200).json({
        message: "Song fetched successfully",
        song
    })
}
async function getSongs(req, res) {
    const { mood } = req.query

    const song = await songModel.find();

    res.status(200).json({
        message: "Song fetched successfully",
        song
    })
}
async function searchSongs(req, res) {
    const { q } = req.query

    if (!q) {
        return res.status(400).json({
            message: "Search query is required"
        })
    }
    const songs = await songModel.find({
        title: { $regex: q, $options: "i" }
    });

    res.status(200).json({
        message: "Songs fetched",
        songs
    });

}


module.exports = {
    uploadSongs,
    getRandomMoodSong,
    getMoodSongs,
    getSongs,
    searchSongs
}