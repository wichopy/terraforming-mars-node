const express = require('express')

const http = require('http');
const firebaseClient = require('./firebase')
const hostname = '127.0.0.1';
const port = 8087;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World!\n');
});

// !!! Test commands!
// firebaseClient.addNewPlayerToInstance('instance1', 'player1')
// firebaseClient.getPlayerGameBoard('instance1', 'player1')
// firebaseClient.addNewInstance('chocolate-sloth')
// 	.then(() => console.log('successfully added new game instance '))
// 	.catch(err => console.log('error with adding game instance: ', err.message))
// firebaseClient.addNewPlayerToInstance('vanilla-sloth', 'will-chou')
// 	.then(res => console.log('I added a new player to game instance', res))
// 	.catch(err => console.log(err.message))
// firebaseClient.getPlayerGameBoard('vanilla-sloth', 'will-chou')


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});