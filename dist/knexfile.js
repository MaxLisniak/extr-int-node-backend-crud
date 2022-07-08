// knex config
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
    development: {
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            port: 3306,
            user: 'root',
            password: process.env.MYSQL_PASSWORD || require("./password").password,
            database: 'defaultDatabase'
        }
    }
};
//# sourceMappingURL=knexfile.js.map