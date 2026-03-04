import { useContext, useEffect } from "react"
import { AuthContext } from "../auth.context"
import { getMe, login, logout, register } from "../services/auth.api"
import { useNavigate } from "react-router"


export const useAuth = () =>{
    const navigate = useNavigate()
    const context = useContext(AuthContext)
    const {user, setUser, loading, setLoading} = context


    async function handleRegister(username, email, password) {
        setLoading(true)
        const data = await register(username, email, password)
        setUser(data.user)
        setLoading(false)
        navigate("/")
    }

    async function handleLogin(email, password) {
        setLoading(true)
        const data = await login(email, password)
        setUser(data.user)
        setLoading(false)
        navigate("/")
    }

    async function handleGetMe() {
        setLoading(true)
        const data = await getMe()
        setUser(data.user)
        setLoading(false)
    }

    async function handleLogout() {
        setLoading(true)
        const data = await logout()
        setUser(null)
        setLoading(false)
        navigate("/")
    }

    useEffect(()=>{
        handleGetMe()
    },[])

    return {
        user,loading, handleRegister, handleLogin, handleGetMe, handleLogout
    }
}