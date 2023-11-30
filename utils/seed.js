const connection = require('../config/connection');
const { Thought, User } = require("../models");
const { thoughts, users } = require("./data");

// establish connection to mongodb server
connection.on('error', (err) => err);

connection.once('open', async () => { 
    // " if collections already exist, drop "
    // if users doesn't exist in the database, array.length will come back falsy (undefined)
    let usersExists = await connection.db.listCollections({ name: "users" }).toArray();
    if (usersExists.length) {
        await connection.dropCollection("users");
    }

    let thoughtExists = await connection.db.listCollections({ name: "thoughts" }).toArray();
    if (thoughtExists.length) {
        await connection.db.dropCollection("thoughts");
    }

    // insert user and thought data for initial 
    await User.collection.insertMany(users);
    console.log("Users added to colllection")

    let userData = await User.find();
    for (const thought of thoughts) {
        thought.user = userData[Math.floor(Math.random() * userData.length)]._id; 
    }

    await Thought.collection.insertMany(thoughts);
    console.log("Thoughts added to collection")

    // Terminate seeding 
    console.log("Seeding complete")
    process.exit(0);
});
