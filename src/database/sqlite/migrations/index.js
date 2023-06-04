const sqliteConnection = require('../../sqlite');
const creadeUsers = require('./createUsers')


async function migrationsRun(){
    const schemas = [
        creadeUsers
    ].join('')

    sqliteConnection()
    .then(db => db.exec(schemas))
    .catch(error => console.error(error))
};
module.exports = migrationsRun;