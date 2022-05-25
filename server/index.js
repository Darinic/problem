import express from 'express'
import database from './database/connection.js'
import users from './controller/users.js'
import profiles from './controller/profiles.js'


const app = express()
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
app.use(express.json())

app.use('/uploads', express.static('uploads'))
app.use('/api/users', users)
app.use('/api/profiles', profiles)

app.listen(3001)