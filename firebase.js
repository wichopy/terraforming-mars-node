var admin = require("firebase-admin");
var serviceAccount = require("./service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_SERVER_URL
});

var fbdb = admin.database();

/*
PUT set	Write or replace data to a defined path, like messages/users/<username>
PATCH update	Update some of the keys for a defined path without replacing all of the data
POST push	Add to a list of data in the database. Every time you push a new node onto a list, your database generates a unique key, like messages/users/<unique-user-id>/<username>
transaction	Use transactions when working with complex data that could be corrupted by concurrent updates
*/

const emptyPlayerBoard = {
  "production": {
    "megaCredits": 0,
    "steel": 0,
    "titanium": 0,
    "plants": 0,
    "energy": 0,
    "heat": 0
  },
  "supply": {
    "megaCredits": 0,
    "steel": 0,
    "titanium": 0,
    "plants": 0,
    "energy": 0,
    "heat": 0 
  }
}

const emptyGameInstance = {
  generation: 0,
  "complete": false,
  "O2": 0,
  "TEMP": -26,
  "OCEAN": 0,
  "TREES": 0,
  "CITIES": 0,
  players: [],
}

// !! Promised based API for creating and reading data to firebase realtime database
const getPlayerGameBoard = (gameName, playerName) => {
  return new Promise((resolve, reject) => {
    const player = fbdb.ref(`instances/${gameName}/players/${playerName}`)

    player.once("value", function (snapshot) {
      console.log('game board for player: ', playerName, ' in instance ', gameName, snapshot.val())
      resolve(snapshot.val())
    })
  })
}

const getGameInstance = (gameName) => {
  return new Promise((resolve, reject) => {
    const instance = fbdb.ref(`instances/${gameName}`)

    instance.once("value", function (snapshot) {
      console.log('value for game instance ', gameName, snapshot.val())
      resolve(snapshot.val())
    })
  })
}

const addNewPlayerToInstance = (gameName, playerName) => {
  return new Promise((resolve, reject) => {
    const players = fbdb.ref(`instances/${gameName}/players`)
    console.log('verify player doesnt already exist')  
    getPlayerGameBoard(gameName, playerName).then((result) => {
      console.log('The playe response was:', result)
      if (result === null) {
        console.log('Add the new player')
        players.update({
          [playerName]: emptyPlayerBoard
        }, function () {
          console.log('Add successful')
          resolve()
        })
      } else {
        reject(new Error(`Player: ${playerName} already exists`))
      }
    })
  })
}

const addNewInstance = gameName => {
  return new Promise((resolve, reject) => {
    const instances = fbdb.ref(`instances`)

    getGameInstance(gameName).then(result => {
      if (result === null) {
        instances.update({
          [gameName]: emptyGameInstance,
        }, function () {
          resolve()
        })
      } else {
        reject(new Error('The game instance ' +gameName + ' already exists.'))
      }
    })
  
  })
}

module.exports = {
  addNewInstance,
  getGameInstance,
  addNewPlayerToInstance,
  getPlayerGameBoard,
}