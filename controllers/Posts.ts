const database = require('../knex.js');
const { body, validationResult } = require('express-validator');
const verifyToken = require('../middleware/verifyToken');
const logger = require("../logger.js");

// queries and returns all posts
const getPosts = [

    async (req, res) => 
    {
        try {
            // query all posts and join with users table
            const posts = await database('posts')
            .join('users', 'users.id', '=', 'author')
            .select('posts.id', 'postText', 'created', 'username')
            .orderBy('created', 'desc');
            logger.info(`${posts.length } posts loaded`);
            res.status(200).json(posts);
        } catch(error) {
            logger.error(`An error occured while querying posts: ${error}`);
            res.sendStatus(500);
        }
    }
]

const createPost = [

    verifyToken,

    // validation rules
    body('postText')
    .exists().withMessage("Post text should be provided")
    .isLength({min: 1}).withMessage("Post should not be blank"),

    async(req, res) => {
            
        // perform validation
        logger.info(`The user with id: ${req.userId} tries to create a post...`);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error(`An erorr occured while the user with id: ${req.userId} tried to create a post: ${JSON.stringify(errors.array())}`);
            return res.status(400).json({ errors: errors.array() });
        }
        try{
            const {postText} = req.body;
            // create new post
            const postId = await database('posts').insert({
                postText: postText,
                author: req.userId
            });
            // query newly created post
            const post = await database('posts')
            .where("posts.id", postId)
            .join("users", "users.id", "=", "author")
            .select("posts.id", "postText", "created", "username");
            logger.info(`The user with id: ${req.userId} created a post : ${JSON.stringify(post[0])}`);
            return res.status(200).json(post[0]);
        } catch (error) {
            logger.error(`An erorr occured while user with id: ${req.userId} tried to create a post: ${JSON.stringify(error)}`);
            return res.status(500).json("Server error");
        }
    },
];

const updatePost = [

    verifyToken,
    
    // validation rules
    body('postText')
    .exists().withMessage("Post text should be provided")
    .isLength({min: 1}).withMessage("Post should not be blank"),

    async (req, res) => {
        // perform validation
        logger.info(`The user with id: ${req.userId} tries to update the post with id ${req.params.id}...`);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error(`An erorr occured while the user with id: ${req.userId} tried to update the post with id ${req.params.id}: ${JSON.stringify(errors.array())}`);
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            // query the post by id
            const post = await database("posts")
            .where("posts.id", Number(req.params.id));

            // if found post has different author return status 403
            if(post[0].author !== req.userId){
                logger.error(`The user with id: ${req.userId} is unable to update the post with id ${req.params.id}...`);
                return res.sendStatus(403);
            }
            // update the post by id
            await database("posts")
            .where("posts.id", Number(req.params.id))
            .update ({
                postText: req.body.postText
            })
            logger.info(`The user with id: ${req.userId} updated the post with id ${req.params.id} : ${req.body.postText}`);
            return res.sendStatus(200);
        } catch (error) {
            logger.error(`An erorr occured while user with id: ${req.userId} tried to update the post with id ${req.params.id}: ${JSON.stringify(error)}`);
            return res.sendStatus(500);
        }
    },
];


const deletePost = [

    verifyToken,

    async (req, res) => {
        try{
            logger.info(`The user with id: ${req.userId} tries to delete the post with id ${req.params.id}...`);
            // find the post by id
            const post = await database("posts")
            .where("posts.id", Number(req.params.id));

            // if found post has different author return status 403
            if(post[0].author !== req.userId){
                logger.error(`The user with id: ${req.userId} is unable to delete the post with id ${req.params.id}`);
                return res.sendStatus(403);
            }
            // delete the post bt id
            await database("posts")
            .where("posts.id", Number(req.params.id))
            .del();
            logger.info(`The user with id: ${req.userId} deleted the post with id ${req.params.id}`);
            res.sendStatus(200);
        } catch (error) {
            logger.error(`An erorr occured while user with id: ${req.userId} tried to delete the post with id ${req.params.id}: ${JSON.stringify(error)}`);
            res.sendStatus(500);
        }
    },
];


module.exports = {
    getPosts,
    createPost,
    updatePost,
    deletePost,
}
export {}