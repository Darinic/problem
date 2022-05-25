import { database } from "../database/connection.js";

export const getAll = async () => {
    try{
        return await database.Profile.findAll()
    }
    catch {
        return false
    }
}

export const getById = async (id) => {
    try{
        return await database.Profile.findByPk(id)
    }
    catch {
        return false
    }
}

export const insert = async (data) => {
    try {
        const profiles = new database.Profile(data)
        await profiles.save()

        return profiles.dataValues.id
    } catch(e) {
        console.log(e)
        return false
    }
}

export const exists = async (fields = {}) => {
    try {
        const count = await database.Profile.count({
            where: fields
        })
        return count != 0
    }catch(e) {
        console.log(e)
        return false
    }
}

export const _delete = async (id) => {
    try {
        const profile = await getById(id)
        await profile.destroy()
    } catch(e) {
        console.log(e)
        return false
    }
}

export const _update = async (id, data) => {
    try{
        await database.Profile.update(data, { where: { id } })
    } catch (e) {
        console.log(e)
    }
}