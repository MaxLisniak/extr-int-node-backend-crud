var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Model } = require('objection');
const knex = require('../knex');
Model.knex(knex);
class User extends Model {
    static get tableName() {
        return 'users';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['username', 'hashedPassword'],
            properties: {
                id: { type: 'integer' },
                username: { type: 'string', minLength: 2 },
                hashedPassword: { type: 'string', minLength: 3 }
            }
        };
    }
}
class Post extends Model {
    static get tableName() {
        return 'posts';
    }
    static get jsonSchema() {
        return {
            type: "object",
            required: ['postText', 'author'],
            properties: {
                id: { type: 'integer' },
                postText: { type: "string", maxLength: 1000 },
                author: { type: "integer" }
            }
        };
    }
}
Post.relationMappings = {
    postAuthor: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
            from: 'posts.author',
            to: 'users.id'
        }
    }
};
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        // await Post.query().insert({postText: "why", author: 1})
        // const posts = await Post.query();
        // console.log(posts)
        const post = yield Post.query().where("postText", "why");
        const user = yield Post.relatedQuery("postAuthor").for(post);
        console.log(user);
    });
}
run();
module.exports = {
    User,
    Post
};
//# sourceMappingURL=Models.js.map