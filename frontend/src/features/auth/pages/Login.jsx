import React, { useState } from 'react'
import '../style/login.scss'
import FormGroup from '../components/FormGroup'
import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Login = () => {
  const { loading, handleLogin } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    handleLogin(email, password)
  }

  return (
    <main className="login-page">
      <div className="form-container">
        <h1>Log in to Moodify</h1>
        <p className="subtitle">Continue your green &amp; black listening session.</p>

        <form onSubmit={handleSubmit}>
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
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <p>
          Don&apos;t have an account?{' '}
          <Link to="/register">
            Register here
          </Link>
        </p>
      </div>
    </main>
  )
}

export default Login