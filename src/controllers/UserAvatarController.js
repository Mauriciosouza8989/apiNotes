const knex = require('../database/knex');
const AppError = require('../utils/AppError')
const Storage = require('../providers/DiskStorage');


class UserAvatarController{
    async update(req, res){
        const user_id = req.user.id;
        const avatarFileName = req.file.filename;

        const DiskStorage = new Storage();

        const user = await knex("users")
        .where({ id: user_id }).first();

        if(!user){
            throw new AppError('Somente usuários autenticados podem mudar o avatar!', 401)
        }
        
        if(user.avatar){
            await DiskStorage.deleteFile(user.avatar);
        }

        const filename = await DiskStorage.saveFile(avatarFileName);
        user.avatar = filename;

        await knex('users').update(user).where({id: user_id});
        res.json(user);


    }
}

module.exports = UserAvatarController