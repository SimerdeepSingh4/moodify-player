import React, {useRef, useState } from 'react'
import './style/create.scss'
import { useSong } from '../hooks/useSong'
import { useNavigate } from 'react-router'

const CreateSong = () => {
    const navigate = useNavigate()
    const { handleUploadSong, loading } = useSong()
    const songInputFieldRef = useRef(null)
    const postImageInputFieldRef= useRef(null)
    const [mood, setMood] = useState(null)
    async function handleSubmit(e){
        e.preventDefault()
        const songFile = songInputFieldRef.current.files[0]
        const posterFile = postImageInputFieldRef.current.files[0]

        if (!songFile) {
            alert("Please select a song file.")
            return
        }

        if (!mood) {
            alert("Please select a mood for this song.")
            return
        }

        await handleUploadSong({ song: songFile, poster: posterFile, mood })
        navigate("/")
    }
    if(loading){
        return (
            <main className="create-page">
                <h1>Loading...</h1>
            </main>
        )
    }
  return (
    <div>
       <main className="create-page">
      <div className="form-container">
        <h1>Upload Songs</h1>
        <p className="subtitle">Continue your green &amp; black listening session.</p>

        <form onSubmit={handleSubmit}>
            <label className= 'labelSong' htmlFor="postSong">Select Song</label>
          <input
            ref={songInputFieldRef}
            hidden
            id='postSong'
            name='postSong'
            type='file'
          />
          <label className='labelImage' htmlFor="postImage">Select Song's Poster</label>
          <input
            ref={postImageInputFieldRef}
            hidden
            id='postImage'
            type='file'
            name='postImage'
          />
          <label className='label'>Select song mood</label>
          <div className="mood-radio">
            {[
              { id: 'happy', label: 'Happy', tagline: 'Bright & energetic' },
              { id: 'sad', label: 'Sad', tagline: 'Slow & emotional' },
              { id: 'surprise', label: 'Surprise', tagline: 'Unexpected mix' },
              { id: 'neutral', label: 'Neutral', tagline: 'Balanced & chill' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                className={`mood-option ${mood === item.id ? 'is-active' : ''}`}
                onClick={() => setMood(item.id)}
              >
                <span className="mood-title">{item.label}</span>
                <span className="mood-tagline">{item.tagline}</span>
              </button>
            ))}
          </div>
          <button className="button" type="submit" disabled={loading}>
            {loading ? 'Uploading..' : 'Upload'}
          </button>
        </form>
      </div>
    </main>
    </div>
  )
}

export default CreateSong


