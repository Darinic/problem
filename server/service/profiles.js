import { database } from "../database/connection.js";

export const getAll = async (conditions = {}) => {
    try{
        return await database.Profile.findAll(conditions)
    }
    catch {
        return false
    }
}

export const getById = async (id) => {
    try{
        return await database.Profile.findByPk(id, {raw: true})
    }
    catch {
        return false
    }
}

export const getByUserId = async (id) => {
    try{
        return await database.Profile.findOne({
            where: {
                UserId: id
            }
        }, {raw:true})
    }catch {
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
        console.log(id, data)
        await database.Profile.update(data, { where: { id } })
        return true
    } catch (e) {
        console.log(e)
        return false
    }
}