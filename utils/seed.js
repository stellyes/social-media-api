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
    console.log("Users added to colllection")
    await Thought.collection.insertMany(thoughts);
    console.log("Thoughts added to collection")

    // create friend associations now that users have been created
    let friendList = [];
    let userData = await User.find();
    for (let i = 0; i < 10; i++) {
        let randomFriender = userData[Math.floor(Math.random() * userData.length)];
        let randomFriended = userData[Math.floor(Math.random() * userData.length)];

        // Ensure that friender DNE friended
        while (randomFriender._id == randomFriended._id) {
            randomFriended = userData[Math.floor(Math.random() * userData.length)];
        }

        // If friend pairing already exists inversely or verbatim, reassign to new 
        if ( friendList.indexOf({ friender: randomFriended._id, friended: randomFriender._id }) != -1 ||
             friendList.indexOf({ friender: randomFriender._id, friended: randomFriended._id}) != -1) {
            while ( friendList.indexOf({ friender: randomFriended._id, friended: randomFriender._id } != -1 ||
                    friendList.indexOf({ friender: randomFriender._id, friended: randomFriended._id}) != -1)) {
                randomFriended = Math.floor(Math.random() * userData.length);
            }
        }
        

        // Add friend to friendList
        friendList.push({
            friender: randomFriender._id,
            friended: randomFriended._id,
            accepted: true
        })
    }

    // Add friends to collection
    await Friend.collection.insertMany(friendList);
    console.log("Friends added to collection")

    // Create likes
    let likeList = [];
    let thoughtData = await Thought.find();
    for (let i = 0; i < 50; i++) {
        let randomUser = userData[Math.floor(Math.random() * userData.length)];
        let randomThought = thoughtData[Math.floor(Math.random() * thoughtData.length)];

        // ensure like doesn't already exist / post isn't by same user in thoughtList and redefine if
        // equivalency condition is met
        if (likeList.indexOf({ thought: randomThought._id, user: randomUser._id }) != -1 ||
            randomThought.user == randomUser._id) {

            while (likeList.indexOf({ thought: randomThought._id, user: randomUser._id }) != -1 ||
                    randomThought.user == randomUser._id){
                randomUser = userData[Math.floor(Math.random() * userData.length)];
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
    console.log("Likes added to collection")

    const updatedThoughts = [];
    for (const thought of thoughtData) {
        for (const like of likeList) {
            if (like.thought == thought._id) {
                thought.likes.push(like._id);
            }
        }
        updatedThoughts.push(thought);
    }

    // With new thought likes added, update existing thoughts in collection
    let thoughtUpdate = await Thought.collection.updateMany({}, updatedThoughts);
    if (thoughtUpdate.modifiedCount != updatedThoughts.length) {
        console.log("Failed to link likes to corresponding thoughts");
    } else {
        console.log("Successfully linked likes to corresponding thoughts")
    }

    const updatedUsers = [];
    for (const user of userData) {
        // Add likes to corresponding users
        for (const like of likeList) {
            if (like.user == user._id) {
                user.likes.push(like._id);
            }
        }

        // Add thoughts to corresponding users
        for (const thought of thoughtData) {
            if (thought.user == user._id) {
                user.thoughts.push(thought._id);
            }
        }

        // Add friends to corresponding users
        for (const friend of friendList) {
            if (friend.friender == user._id ||
                friend.friended == user._id) {
                    user.friends.push(friend._id);
            }
        }

        updatedUsers.push(user);
    }

    // With new user data added, update existing users in collection
    let userUpdate = await USER.collection.updateMany({}, updatedUsers);
    if (userUpdate.modifiedCount != updatedUsers.length) {
        console.log("Failed to link users to corresponding friends");
    } else {
        console.log("Successfully linked users to corresponding friends")
    }

    // Terminate seeding 
    console.log("Seeding complete")
    process.exit(0);
});
