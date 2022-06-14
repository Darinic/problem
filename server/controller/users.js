import  express  from "express";
import { exists, getUserByEmail, insert } from "../service/users.js";
import Joi from "joi";
import bcrypt from 'bcrypt'
import validator from "../middleware/validator.js";
import jsonwebtoken from 'jsonwebtoken'
import { loadJsonFile } from "load-json-file";

const config = await loadJsonFile('./config.json')

const Router = express.Router();

const registerSchema = (req, res, next) => {
    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required()
    })

    validator(req, next, schema)
}

const loginSchema = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    })

    validator(req, next, schema)
}

Router.post('/login', loginSchema, async(req, res) => {
    const user = await getUserByEmail(req.body.email)

    if(!user) {
        res.json({message: 'Nepavyko rasti tokio vartotojo', status: 'danger'})
        return
    }

    if(!await bcrypt.compare(req.body.password, user.password)) {
    res.json({message: 'Neteisingas slaptažodis', status: 'danger'})
    return
    }
    console.log(config.secret)

    const data = {email: req.body.email, id: user.id}
    const token= jsonwebtoken.sign(data, config.secret, {
        expiresIn: '1h'
    })
    res.cookie('token', token)
    res.json({message: 'Prisijungimas sėkimingas', status: 'success'})
})

Router.post('/register', registerSchema,  async (req, res) => {
    
    if(await exists({
        email: req.body.email
    })) {
        res.json({status: 'danger', message: 'Toks vartotojas jau egzistuoja'})
        return
    } 
    
    req.body.password = await bcrypt.hash(req.body.password, 10)

    if(await insert(req.body)) {
        res.json({status: 'success', message: 'Varototojas sėkmingai sukurtas'})
    } else {
        res.json({status: 'danger', message: 'Įvyko klaida'})
    }
})

export default Router