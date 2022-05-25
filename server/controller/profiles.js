import express from 'express'
import { getAll, getById, insert, _delete, _update, exists } from '../service/profiles.js'
import {insert as portfolioInsert} from '../service/portfolio.js'
import Joi from 'joi'
import validator from "../middleware/validator.js"
import multer from 'multer'
import {access, mkdir} from 'fs/promises'

const Router= express.Router()

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const path = './uploads/' + req.body.UserId
        try {
            await access(path)
        }catch {
            await mkdir(path, {recursive: true})
        }

        cb(null, path)
        },
        filename: (req, file, callback) => {
            const ext = file.originalname.split('.')
     
            callback(null, Date.now() + '.' + ext[1])
        }
    })

    const upload = multer({ 
        storage: storage,
        fileFilter: (req, file, callback) => {
            //Atliekamas failu formato tikrinimas
            if(
                file.mimetype === 'image/jpeg' ||
                file.mimetype === 'image/png' ||
                file.mimetype === 'image/gif'
            ) {
                callback(null, true)
            } else {
                callback(null, false)
            }
        }
     })

Router.get('/', async (req,res) => {
    const profiles= await getAll()

    if(profiles) {
        res.json(profiles)
    }else {
        res.json({message: 'Įvyko klaida' , status: 'danger'})
    }
})

Router.get('/:id', async (req, res) => {
    const id = req.params.id
    try{
        let entries = await getById(id)
        res.json({status: 'success', message: entries})
    }catch {
        res.json({status: 'danger', message: 'Nepavyko surasti profilio'})
    }
})

const profileSchema = (req, res, next) => {
    const schema = Joi.object({
        headline: Joi.string(),
        subheadline: Joi.string(),
        description: Joi.string(),
        hourly_rate: Joi.number().required(),
        location: Joi.string(),
        UserId: Joi.number(). required()
    })

    validator(req, next, schema)
}

    const profileFileFields = upload.fields([
        {name: 'profile_image', maxCount: 1},
        {name: 'portfolio_items', maxCount: 20}
    ])

    Router.post('/create', profileFileFields, profileSchema,  async (req, res) => {
        if(await exists({
            UserId: req.body.UserId
        })) {
            res.json({status: 'danger', message: 'Profilis šiam vartotojui jau yra sukurtas'})
            return
        }
       
        if(req.files.profile_image) {
            let path = req.files.profile_image[0].path.replaceAll('\\', '/')
            req.body.profile_image = path
        }
       
        let ProfileId= false
        if(ProfileId = await insert(req.body)) {
            req.files.portfolio_items.map(async image => {
                let path = image.path.replaceAll('\\', '/')
                await portfolioInsert({ image_url: path, ProfileId })
            })
            res.json({status: 'success', message: 'Profilis sėkmingai sukurtas'})
        } else {
            res.json({status: 'danger', message: 'Įvyko klaida'})
        }
    })

// Router.post('/upload',upload.single('profile_image'), profileSchema, async (req,res) => {
//     res.send('Done')
// })

Router.delete('/delete/:id', async(req, res) => {
        const id = req.params.id

        try {
            await _delete(id)
            res.json({status: 'success', message: 'Profilis sėkmingai ištrinta'})
        }catch {
            res.json({status: 'danger', message: 'Nepavyko ištrinti profilio'})
        }
})

Router.put('/update/:id', async (req, res) => {
    const id = req.params.id
    const profile = req.body

    try{
        await _update(id, profile)
        res.json({status:'success', message: "profilis sėkmingai atnaujintas"})
    }catch {
        res.json({status:'danger', message: "Nepavyko atnaujinti profilio"})
    }
})
export default Router