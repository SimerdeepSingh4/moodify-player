const express = require('express');
const authRouter = require('./routes/auth.routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const songRouter = require('./routes/song.routes');

const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

app.use('/api/auth', authRouter)
app.use('/api/songs', songRouter)

module.exports = app