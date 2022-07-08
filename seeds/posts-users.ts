/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async (knex: import("knex").Knex): Promise<void> => {
   try {
     await knex('users').del(); // delete all users first
     await knex('posts').del(); // delete all posts

     await knex('users').insert([
       { username: 'max', hashedPassword: "fss" },
       { username: "john", hashedPassword: "fff" },
     ]);

     return knex('posts').insert([
       { postText: 'Lorem1', author: 1 },
       { postText: 'Lorem2', author: 1 },
       { postText: 'Lorem3', author: 1 },
     ]);
   } catch (error) {
     console.log(`Error seeding data: ${error}`);
   }
 }