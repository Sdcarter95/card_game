// server/index.ts
import express from 'express';
import { newGame, Card, Suit, nextRound } from './gameLogic';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

app.get('/newGame', async (req, res) => {
  try {
    
    const response = await newGame();
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create a new game.' }); //check this
  }
});

app.get('/nextRound', async (req, res) => {
  try {

    const response = await nextRound();
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to play next Rounds' }); //check this
  }
});


export async function createDeck(): Promise<string> {
  try {
    const response = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'); // Use axios.get
    
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
    const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`); // Use axios.get
    
    if (response.status !== 200) { // Axios doesn't use ok property; check status
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = response.data; // No need for an explicit type annotation
    const card = data.cards[0];
    return card ? { value: card.value, suit: card.suit as Suit } : null;
  } catch (error) {
    throw new Error('Failed to draw a card from the deck.');
  }
}




