import express from 'express';
import { newGame, Card, Suit, nextRound } from './gameLogic';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';
import { Server } from 'socket.io';
import http from 'http'; // Import the http module

const app = express();
const port = process.env.PORT || 3001;
const server = http.createServer(app);
console.log(`Server is listening on port ${port}`);
const io = new Server(server);

// Keep track of connected players
const connectedPlayers: Set<string> = new Set();
let turnCounter: number = 0;
let roundResult: string = "";

app.use(cors());
app.use(bodyParser.json());

// Handle WebSocket connections
io.on('connection', async (socket) => {

  if (!connectedPlayers.has(socket.id)) {
    console.log('User ' + socket.id + ' connected');
    connectedPlayers.add(socket.id); // Add the player's socket ID to the set of connected players
  }


  if (connectedPlayers.size == 2) {
    await newGame();
    io.emit('gameStart', "Draw to begin");
  } else {
    socket.emit('waitingForPlayers', 'Waiting for more players to join...');
  }

  // Listen for "nextRound" event from clients
  socket.on('nextRound', async () => {
    if (connectedPlayers.size >= 2) {
      // Handle the logic for the next round and broadcast the result to all clients
      if(turnCounter == 0){
        roundResult = await nextRound(); //start of a new round
      }

      //sort results
      const finalResult = roundResult.split("|r|")[1];
      const roundInfo = roundResult.split("|r|")[0];
      const roundNumber = roundInfo.split("|c|")[0];
      const player1Result = roundInfo.split("|c|")[1];
      const player2Result = roundInfo.split("|c|")[2];



      if (turnCounter == 0){
        io.emit("roundResult", "");
        io.emit("opponentResult", "");
        io.emit("drawResult", "");
        io.emit("roundNumber", roundNumber);
      }
      //if a player draws a card before another, they can only see their own card and not the result of the match.
      if (turnCounter < 2) {
        turnCounter++;
        if ([...connectedPlayers][0] === socket.id) { //player 1
          socket.emit('drawResult', player1Result)
          io.to([...connectedPlayers][1]).emit('opponentResult', player1Result);
        } else { //player 2
          socket.emit('drawResult', player2Result); 
          io.to([...connectedPlayers][0]).emit('opponentResult', player2Result);
        }

      } 
      if (turnCounter >= 2) { // if both players have played, the results will be displayed. 
        turnCounter = 0;
        io.emit('roundResult', finalResult); // Broadcast the result to all clients
      }

    } else {
      socket.emit('waitingForPlayers', 'Waiting for more players to join...');
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');

    // Remove the player's socket ID from the set of connected players
    connectedPlayers.delete(socket.id);

    // If a player disconnects and there are fewer than two players, end the game
    if (connectedPlayers.size < 2) {
      io.emit('endGame', 'Not enough players to continue the game.');
    }
  });
});

app.get('/newGame', async (req, res) => {
  try {
    const response = await newGame();
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create a new game.' });
  }
});

app.get('/nextRound', async (req, res) => {
  try {
    const response = "await nextRound()";
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to play next Rounds' });
  }
});

export async function createDeck(): Promise<string> {
  try {
    const response = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
    if (response.status !== 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = response.data;
    return data.deck_id;
  } catch (error) {
    throw new Error('Failed to create a new deck.');
  }
}

export async function drawCard(deckId: string): Promise<Card | null> {
  try {
    const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
    if (response.status !== 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = response.data;
    const card = data.cards[0];
    return card ? { value: card.value, suit: card.suit as Suit } : null;
  } catch (error) {
    throw new Error('Failed to draw a card from the deck.');
  }
}

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
