const { Model } = require('objection');
const knex = require('../knex');

Model.knex(knex);

class User extends Model{
    static get tableName(){
        return 'users'
    }

    static get jsonSchema(){
        return {
            type: 'object',
            required: ['username', 'hashedPassword'],
            properties: {
                id: {type: 'integer'},
                username: {type: 'string', minLength: 2},
                hashedPassword: {type: 'string', minLength: 3}
            }
        }
    }
}
class Post extends Model{
    static get tableName(){
        return 'posts'
    }
    static get jsonSchema(){
        return {
            type: "object",
            required: ['postText', 'author'],
            properties: {
                id: {type: 'integer'},
                postText: {type: "string", maxLength: 1000},
                author: {type: "integer"}
            }
        }
    }
    static relationMappings = {
        postAuthor: {
            relation: Model.BelongsToOneRelation,
            modelClass: User,
            join: {
                from: 'posts.author',
                to: 'users.id'
            }
        }
    }
}

async function run(){
    // await Post.query().insert({postText: "why", author: 1})
    const posts = await Post.query();
    // console.log(posts)
    const post = await Post.query().where("postText", "why");
    const user = await Post.relatedQuery("postAuthor").for(post);
    console.log(user)
}
run()
module.exports = {
    User,
    Post
};