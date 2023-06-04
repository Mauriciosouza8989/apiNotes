const { hash, compare } = require('bcryptjs')
const AppError = require('../utils/AppError');
const sqliteConection = require('../database/sqlite')

class UsersController{
    async create(req, res){
        const {name, email, password} = req.body;
        const database = await sqliteConection();
        const checkUserExist = await database.get("SELECT * FROM users WHERE email = (?)", [email]);
        if(checkUserExist){
            throw new AppError("Este émail já esta em uso!")
        }
        
        const hashPassword = await hash(password, 8); 

        await database.run("INSERT INTO users (name, email, password) VALUES(?, ?, ?)", [name, email, hashPassword]);

        return res.status(201).json();
    }

    async update(req, res) {
        const { name, email, password, oldPassword } = req.body;
        const user_id = req.user.id;;
        const database = await sqliteConection();
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

        if (!user) {
            throw new AppError("Usuario não encontrado");
        }

        const userWithUpdateEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

        if(userWithUpdateEmail && userWithUpdateEmail.id !== user.id){
            throw new AppError("Este email já está em uso.");
        }

        if(password && !oldPassword){
            throw new AppError("Você precisa digitar a senha antiga para definir a nova senha!");
        }


        user.name = name ?? user.name;
        user.email = email ?? user.email;

        if(password && oldPassword){
            const checkOldPassword = await compare(oldPassword, user.password);
            if(!checkOldPassword){
                throw new AppError("A senha antiga não confere!");
            }
            user.password = await hash(password, 8);
        }



        await database.run(`
        UPDATE users SET
        name = ?,
        email = ?,
        password = ?,
        updated_at = DATETIME('now')
        WHERE id = ?
        `,[user.name, user.email, user.password, user_id]
        );

        return res.status(200).json();
    }
};


module.exports = UsersController;