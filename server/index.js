import express from 'express'
import database from './database/connection.js'
import users from './controller/users.js'
import profiles from './controller/profiles.js'
import cookieParser from 'cookie-parser'
import auth from './middleware/authentication.js'
import {dirname} from 'path';
import { fileURLToPath } from 'url';


const app = express()
const __dirname = dirname(fileURLToPath(import.meta.url))
// const hbs = create()

//Handlebars variklio prijungimas
// app.engine('handlebars', hbs.engine)
// app.set('view engine', 'handlebars')
// app.set('views', './templates')

//Statiniu failu perdavimas adrese /assets i narsykle is folderio assets
// app.use('/assets', express.static('assets'))

//POST metodu perduodamu duomenu  
app.use( express.urlencoded({
  extended: false
}))

//Perduodamu duomenu body lygmenyje json formatu issifravimas
app.use(cookieParser())
app.use(express.json())

app.use('/uploads', express.static('uploads'))
app.use('/', express.static('public'))
app.use('/api/users', users)
app.use('/api/profiles', profiles)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
  })

app.get('/checkAuth', auth, (req, res) => {
  res.json(req.authData)
})


app.listen(3001)