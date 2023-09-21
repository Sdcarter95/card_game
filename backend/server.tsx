import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';
import { Server } from 'socket.io';
import http from 'http';

import { newGame, nextRound } from './gameLogic';
import { Card, Suit } from './gameLogic';

const app = express();
const port = process.env.PORT || 3001;
const server = http.createServer(app);
console.log(`Server is listening on port ${port}`);
const io = new Server(server);

const connectedPlayers: Set<string> = new Set();
let turnCounter: number = 0;
let roundResult: string = "";

app.use(cors());
app.use(bodyParser.json());

io.on('connection', async (socket) => {
  if (!connectedPlayers.has(socket.id)) {
    console.log(`User ${socket.id} connected`);
    connectedPlayers.add(socket.id);
  }

  if (connectedPlayers.size === 2) {
    await newGame();
    io.emit('gameStart', 'Draw to begin');
  } else {
    socket.emit('waitingForPlayers', 'Waiting for more players to join...');
  }

  socket.on('nextRound', async () => {
    if (connectedPlayers.size >= 2) {
      if (turnCounter === 0) {
        roundResult = await nextRound();
      }

      const finalResult = roundResult.split('|r|')[1];
      const roundInfo = roundResult.split('|r|')[0];
      const roundNumber = roundInfo.split('|c|')[0];
      const player1Result = roundInfo.split('|c|')[1];
      const player2Result = roundInfo.split('|c|')[2];

      if (turnCounter === 0) {
        io.emit('roundResult', '');
        io.emit('opponentResult', '');
        io.emit('drawResult', '');
        io.emit('roundNumber', roundNumber);
      }

      if (turnCounter < 2) {
        turnCounter++;
        if ([...connectedPlayers][0] === socket.id) {
          socket.emit('drawResult', player1Result);
          io.to([...connectedPlayers][1]).emit('opponentResult', player1Result);
        } else {
          socket.emit('drawResult', player2Result);
          io.to([...connectedPlayers][0]).emit('opponentResult', player2Result);
        }
      }

      if (turnCounter >= 2) {
        turnCounter = 0;
        io.emit('roundResult', finalResult);
      }
    } else {
      socket.emit('waitingForPlayers', 'Waiting for more players to join...');
    }
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);
    connectedPlayers.delete(socket.id);

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
    const response = await nextRound();
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to play next rounds.' });
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
