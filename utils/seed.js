const connection = require('../config/connection');
const { Friend, Like, Thought, User } = require("../models");
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

    let likeExists = await connection.db.listCollections({ name: "likes" }).toArray();
    if (likeExists.length) {
        await connection.db.dropCollection("likes");
    }

    let friendExists = await connection.db.listCollections({ name: "friends" }).toArray();
    if (friendExists.length) {
        await connection.db.dropCollection("friends");
    }

    // insert user and thought data for initial 
    await User.collection.insertMany(users);
    await Thought.collection.insertMany(thoughts);

    // create friend associations now that users have been created
    let friendList = [];
    let userData = await connection.db.listCollections({ name: "users" }).toArray();
    for (let i = 0; i < 25; i++) {
        const randomFriender = Math.floor(Math.random() * userData.length);
        const randomFriended = Math.floor(Math.random() * userData.length);

        // Ensure that friender DNE friended
        while (randomFriender == randomFriended) {
            randomFriended = Math.floor(Math.random() * userData.length);
        }

        // If friend pairing already exists inversely, reassign to new 
        for (const friend of friendList) {
            if ( friend == { friender: randomFriended._id, friended: randomFriender._id }) {
                while ( friend == { friender: randomFriended._id, friended: randomFriender._id }) {
                    randomFriended = Math.floor(Math.random() * userData.length);
                }
                // Once match is found and given reassigned value, exit loop
                break;
            }
        }

        // Add friend to friendList
        friendList.push({
            friender: randomFriender._id,
            friended: randomFriended._id
        })
    }

    // Add friends to collection
    await Friend.collection.insertMany(friendList);

    // Create likes
    let likeList = [];
    let thoughtData = await connection.db.listCollections({ name: "thoughts" }).toArray();
    for (let i = 0; i < 50; i++) {
        const randomUser = userData[Math.floor(Math.random() * userData.length)];
        const randomThought = thoughtData[Math.floor(Math.random() * thoughtData.length)];

        // ensure like doesn't already exist in thoughtList and redefine if
        // equivalency condition is met
        for (const like of likeList) {
            if (like == { thought: randomThought._id, user: randomUser._id }) {
                while (like == { thought: randomThought._id, user: randomUser._id }){
                    randomUser = userData[Math.floor(Math.random() * userData.length)];
                }
                // after match is found and reassigned, break d
                break;
            }
        }

        // Add like to likeList
        likeList.push({
            thought: randomThought._id,
            user: randomUser._id
        });
    }

    // Add likes to collection
    await Like.collection.insertMany(likeList);

});
