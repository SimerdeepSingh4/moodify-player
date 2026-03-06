import { useEffect, useMemo, useRef, useState } from 'react'
import { useSong } from '../hooks/useSong'
import './style/player.scss'
import { Slider } from "../../../components/ui/slider"
import 'remixicon/fonts/remixicon.css'
const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const Player = ({ sameMoodSongs = [], onSelectSong }) => {
  const audioRef = useRef(null)
  const { song, loading } = useSong()
  const selectSong = onSelectSong || (() => {})

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(80)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const progress = useMemo(() => {
    if (!duration) return 0
    return Math.min((currentTime / duration) * 100, 100)
  }, [currentTime, duration])

  const currentSongIndex = useMemo(() => {
    if (!song?.url || sameMoodSongs.length === 0) return -1
    return sameMoodSongs.findIndex((item) => item.url === song.url)
  }, [sameMoodSongs, song?.url])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setCurrentTime(audio.currentTime || 0)
    const onLoaded = () => setDuration(audio.duration || 0)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoaded)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoaded)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.load()
    setCurrentTime(0)
    setDuration(0)

    if (song?.url) {
      setIsPlaying(true)
    }
  }, [song?.url])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  const togglePlayPause = () => setIsPlaying((prev) => !prev)

  const handleSeek = (values) => {
    const next = values[0] ?? 0
    setCurrentTime(next)
    if (audioRef.current) {
      audioRef.current.currentTime = next
    }
  }
  const handleMute = ()=>{
    if(volume > 0){
      setVolume(0)
    }
    else{
      setVolume(80)
    }
  }

  const playRelativeSong = (step) => {
    if (sameMoodSongs.length === 0 || currentSongIndex < 0) return

    const nextIndex = (currentSongIndex + step + sameMoodSongs.length) % sameMoodSongs.length
    selectSong({ selectedSong: sameMoodSongs[nextIndex] })
  }

  return (
    <>
      <audio ref={audioRef} src={song?.url || ''} preload="metadata" />

      <section className="dock-player">
        <div className="dock-now-playing">
          <img src={song?.posterUrl || 'https://via.placeholder.com/80x80?text=M'} alt={song?.title || 'Poster'} />
          <div>
            <h4>{song?.title || 'Select a track'}</h4>
            <p>{song?.mood || 'mood not set'}</p>
          </div>
        </div>

        <div className="dock-controls">
          <div className="control-row">
            <button onClick={() => playRelativeSong(-1)} type="button"><i className="ri-skip-back-fill"></i></button>
            <button className="primary" onClick={togglePlayPause} type="button" disabled={!song?.url}>
              {isPlaying ? <i className="ri-pause-fill"></i> : <i className="ri-play-fill"></i>}
            </button>
            <button onClick={() => playRelativeSong(1)} type="button"><i className="ri-skip-forward-fill"></i></button>
            
            <Slider className="w-[96px] " min={0} value={[volume]}  max={100} step={1} onValueChange={(values) => setVolume(values[0])} />
            <button type="submit" onClick={handleMute}>
            {volume==0 ? <i className="ri-volume-mute-fill"></i> : <i className="ri-volume-up-fill"></i>}
          </button>
          </div>

          <div className="progress-row">
            <span>{formatTime(currentTime)}</span>
            {/* <input type="range" min="0" max={duration || 0} value={currentTime} onChange={handleSeek} /> */}
            <Slider className="w-full " min={0} max={duration || 0} step={1} value={[currentTime]}  onValueChange={handleSeek} />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="dock-side-actions">
        
          <button type="button" onClick={() => setIsFullscreen(true)}>
            <i className="ri-fullscreen-line"></i>
          </button>
        </div>

      </section>

      {isFullscreen && (
        <section className="fullscreen-player">
          <div className="fullscreen-left">
            <button className="close-btn" type="button" onClick={() => setIsFullscreen(false)}>
              Close
            </button>

            <img src={song?.posterUrl || 'https://via.placeholder.com/420x420?text=Moodify'} alt={song?.title || 'Poster'} />
            <h2>{song?.title || 'No song selected'}</h2>
            <p>{song?.mood || 'unknown mood'}</p>

            <div className="fullscreen-controls">
              <button onClick={() => playRelativeSong(-1)} type="button">Prev</button>
              <button className="primary" onClick={togglePlayPause} type="button" disabled={!song?.url}>
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button onClick={() => playRelativeSong(1)} type="button">Next</button>
            </div>

            <div className="fullscreen-progress">
            <Slider className="w-full " min={0} max={duration || 0} step={1} value={[currentTime]}  onValueChange={handleSeek} />
              <div className="time-labels">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          <aside className="fullscreen-right">
            <div className="right-header">
              <h3>More {song?.mood || ''} songs</h3>
              {loading && <span>Loading...</span>}
            </div>

            <div className="recommendation-list">
              {sameMoodSongs.map((track) => (
                <button
                  key={track._id || track.url}
                  className={`recommend-item ${song?.url === track.url ? 'active' : ''}`}
                  onClick={() => selectSong({ selectedSong: track })}
                >
                  <img src={track.posterUrl} alt={track.title} />
                  <div>
                    <h4>{track.title}</h4>
                    <p>{track.mood}</p>
                  </div>
                </button>
              ))}
            </div>
          </aside>
        </section>
      )}
    </>
  )
}

export default Player
