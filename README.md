# Backend Social Media API 
For a video tutorial on how to test this API, click [here](https://youtu.be/K1hXsV_hL0I).

## Installation
To install the project, navigate to the directory you stored the repository and run `npm i`, followed by `npm run seed` to seed the database.

## Usage
To use the application, run `npm run start` in your terminal.

## Endpoints
- /api/users
	- GET: gets all users
	- POST: create new user
- /api/users/:_id
	- GET: get specific user
	- PUT: update specific user
	- DELETE: delete specific user
- /api/users/:userId/friends/:friendId
	- POST: create new friend association
	- DELETE: delete friend association
- /api/thoughts
	- GET: get all thoughts
	- POST: create new thought
- /api/thoughts/:_id
	- GET: get specific thought
	- PUT: update specific thought
	- DELETE: delete specific thought
- /api/thoughts/:thoughtId/reactions
	- POST: create new reaction 
	- DELETE: delete specific reaction

## Author
Ryan England ([Github](https://github.com/stellyes), [LinkedIn](https://www.linkedin.com/in/ryan-england-4909b3291/))