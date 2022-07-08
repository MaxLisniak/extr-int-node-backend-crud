var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = (knex) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield knex('users').del(); // delete all users first
        yield knex('posts').del(); // delete all posts
        yield knex('users').insert([
            { username: 'max', hashedPassword: "fss" },
            { username: "john", hashedPassword: "fff" },
        ]);
        return knex('posts').insert([
            { postText: 'Lorem1', author: 1 },
            { postText: 'Lorem2', author: 1 },
            { postText: 'Lorem3', author: 1 },
        ]);
    }
    catch (error) {
        console.log(`Error seeding data: ${error}`);
    }
});
//# sourceMappingURL=posts-users.js.map