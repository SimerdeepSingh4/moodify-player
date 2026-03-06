import { useContext } from "react"
import { SongContext } from "../song.context"
import { getMoodSong, getRandomMoodSong, getSongs, searchSongs, uploadSong } from "../service/song.api"



export const useSong = () => {
    const context = useContext(SongContext)
    const { song, setSong, loading, setLoading } = context

    async function handleRandomMoodSong({ mood }) {
        try {
            setLoading(true)
            const data = await getRandomMoodSong({ mood })
            const randomSong = Array.isArray(data?.song) ? data.song[0] : data?.song
            if (randomSong) {
                setSong(randomSong)
            }
            return randomSong
        } finally {
            setLoading(false)
        }
    }

    async function handleMoodSong({ mood }) {
        try {
            setLoading(true)
            const data = await getMoodSong({ mood })
            const moodSongs = Array.isArray(data?.song) ? data.song : []
            if (moodSongs.length > 0) {
                setSong(moodSongs[0])
            }
            return moodSongs
        } finally {
            setLoading(false)
        }
    }

    async function handleGetSongs() {
        try {
            setLoading(true)
            const data = await getSongs()
            return Array.isArray(data?.song) ? data.song : []
        } finally {
            setLoading(false)
        }
    }

    async function handleSearchSongs({ q }) {
        try {
            setLoading(true)
            const data = await searchSongs({ q })
            return Array.isArray(data?.songs) ? data.songs : []
        } finally {
            setLoading(false)
        }
    }

    async function handleSelectSong({ selectedSong }) {
        if (selectedSong) {
            setSong(selectedSong)
        }
    }

    async function handleUploadSong({ song, poster, mood }) {
        try {
            setLoading(true)
            const data = await uploadSong({ song, poster, mood })
            return data
        } finally {
            setLoading(false)
        }
    }
    return ({
        song,
        handleMoodSong,
        handleGetSongs,
        handleRandomMoodSong,
        handleSearchSongs,
        handleSelectSong,
        handleUploadSong,
        loading
    })
}
