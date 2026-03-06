import { useContext, useEffect, useMemo, useState } from 'react'
import FaceExpression from '../../Expression/components/FaceExpression'
import Player from '../components/Player'
import { useSong } from '../hooks/useSong'
import { AuthContext } from '../../auth/auth.context'
import './style/home.scss'
import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'

const Home = () => {
  const { user } = useContext(AuthContext)
  const { song, handleGetSongs, handleSelectSong, loading } = useSong()
  const navigate = useNavigate()
  const {handleLogout} = useAuth()
  const [open, setOpen] = useState(false);
  const [allSongs, setAllSongs] = useState([])
  const [searchText, setSearchText] = useState('')
  const [activeMood, setActiveMood] = useState('all')

  useEffect(() => {
    const loadSongs = async () => {
      const songs = await handleGetSongs()
      setAllSongs(songs)
    }

    loadSongs()
  }, [])

  const filteredSongs = useMemo(() => {
    const query = searchText.trim().toLowerCase()

    return allSongs.filter((item) => {
      const matchesMood = activeMood === 'all' || item.mood === activeMood
      if (!query) return matchesMood

      const title = item.title?.toLowerCase() || ''
      const mood = item.mood?.toLowerCase() || ''
      return matchesMood && (title.includes(query) || mood.includes(query))
    })
  }, [allSongs, searchText, activeMood])

  const songsByMood = useMemo(() => {
    return filteredSongs.reduce((acc, item) => {
      const mood = item.mood || 'unknown'
      if (!acc[mood]) acc[mood] = []
      acc[mood].push(item)
      return acc
    }, {})
  }, [filteredSongs])

  const moodList = useMemo(() => {
    const moods = Array.from(new Set(allSongs.map((item) => item.mood).filter(Boolean)))
    return ['all', ...moods]
  }, [allSongs])

  const sameMoodSongs = useMemo(() => {
    if (!song?.mood) return []
    return allSongs.filter((item) => item.mood === song.mood)
  }, [song?.mood, allSongs])

  const userInitial = (user?.username || user?.email || 'U').charAt(0).toUpperCase()

  return (
    <main className="music-layout">
      <aside className="music-sidebar">
        <div className="sidebar-logo">
          <div className="logo-dot" />
          <span>Sentix Setup</span>
        </div>

        <FaceExpression />

        <div className="mood-filter">
          <h3>Quick Mood Filter</h3>
          <div className="mood-chips">
            {moodList.map((mood) => (
              <button
                key={mood}
                className={`mood-chip ${activeMood === mood ? 'is-active' : ''}`}
                onClick={() => setActiveMood(mood)}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <section className="music-main">
        <header className="top-nav">
          <div className="app-brand">
            <div className="brand-icon"><img src="https://ik.imagekit.io/dhyh95euj/moodify/Logo/Sentix_logo.svg" alt="Sentix Logo" /></div>
            <div className="brand-text">
              <p>Sentix</p>
              <span>Emotion Player</span>
            </div>
          </div>

          <label className="search-box">
            <input
              type="text"
              placeholder="Search songs or mood"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
          </label>
          <button onClick={() => navigate('/create')} className="add-song">Add Song</button>
          <button className="profile-pill" type="button">
            <span>{userInitial}</span>
          </button>
        </header>

        <section className="mood-sections">
          {Object.keys(songsByMood).length === 0 && !loading && (
            <div className="empty-state">No songs found for this filter.</div>
          )}

          {Object.entries(songsByMood).map(([mood, songs]) => (
            <article key={mood} className="mood-block">
              <div className="mood-block-header">
                <h2>{mood}</h2>
                <p>{songs.length} tracks</p>
              </div>

              <div className="mood-song-row">
                {songs.map((track) => (
                  <button
                    key={track._id || track.url}
                    className={`song-card ${song?.url === track.url ? 'is-playing' : ''}`}
                    onClick={() => handleSelectSong({ selectedSong: track })}
                  >
                    <img src={track.posterUrl} alt={track.title} />
                    <div className="song-meta">
                      <h4>{track.title}</h4>
                      <span>{track.mood}</span>
                    </div>
                  </button>
                ))}
              </div>
            </article>
          ))}
        </section>
      </section>

      <Player sameMoodSongs={sameMoodSongs} onSelectSong={handleSelectSong} />
    </main>
  )
}

export default Home