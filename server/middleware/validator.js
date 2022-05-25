const validator = (req, next, schema) => {
    const options = {
        abortEarly: false, //nutraukiam validacija po pirmos nesekmes
        allowUnknown: true, //Leidimas priimti indeksus kuriu nėra schemoje
        stripUnknown: true //Pasalinamos reiksmes kurios nenurodytos schemoje
    }

    const {error, value} = schema.validate(req.body, options)

    if(error) {
        next('Įvyko validacijos klaida')
    } else {
        req.body =  value
        next()
    }
}

export default validator