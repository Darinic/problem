import  express  from "express";
import { exists, insert } from "../service/users.js";
import Joi from "joi";
import bcrypt from 'bcrypt'
import validator from "../middleware/validator.js";

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