import axios from "axios";


const api = axios.create({
    baseURL: "http://localhost:3000/api/songs",
    withCredentials: true
})


export async function getRandomMoodSong({ mood }) {
    const response = await api.get("/?mood=" + mood)
    return response.data
}

export async function getMoodSong({ mood }) {
    const response = await api.get("/mood-songs?mood=" + mood)
    return response.data
}
export async function getSongs() {
    const response = await api.get("/all-songs")
    return response.data
}

export async function searchSongs({ q }) {
    const response = await api.get("/search-songs?q=" + q)
    return response.data
}

export async function uploadSong({ song, poster, mood }) {
    const formData = new FormData()
    formData.append("song", song)
    if (poster) {
        formData.append("poster", poster)
    }
    formData.append("mood", mood)

    const response = await api.post("/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return response.data
}