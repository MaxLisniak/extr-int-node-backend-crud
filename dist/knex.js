// set database connection using knex config
const environment = process.env.ENVIRONMENT || 'development';
const config = require('./knexfile.js')[environment];
module.exports = require('knex')(config);
//# sourceMappingURL=knex.js.map