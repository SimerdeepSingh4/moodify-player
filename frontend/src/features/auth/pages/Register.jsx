import React, { useState } from 'react'
import '../style/register.scss'
import FormGroup from '../components/FormGroup'
import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Register = () => {
  const { loading, handleRegister } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    handleRegister(username, email, password)
  }

  return (
    <main className="register-page">
      <div className="form-container">
        <h1>Create your account</h1>
        <p className="subtitle">Sign up to save your mood‑based playlists.</p>

        <form onSubmit={handleSubmit}>
          <FormGroup
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            label="Username"
            placeholder="Enter your username"
          />
          <FormGroup
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            placeholder="Enter your email"
          />
          <FormGroup
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            placeholder="Enter your password"
          />
          <button className="button" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <p>
          Already have an account?{' '}
          <Link to="/login">
            Login here
          </Link>
        </p>
      </div>
    </main>
  )
}

export default Register