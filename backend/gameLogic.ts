import { createDeck } from "./server";
import { drawCard } from "./server";

export enum Suit {
  Hearts = "hearts",
  Diamonds = "diamonds",
  Clubs = "clubs",
  Spades = "spades",
}

export type Card = {
  value: string;
  suit: Suit;
};

type Player = {
  name: string;
  deck: Card[];
};

let roundGenerator: any;



async function* playWarRound(deckId: string): AsyncGenerator<string, void, unknown> {
  const player1: Player = { name: "Player 1", deck: [] };
  const player2: Player = { name: "Player 2", deck: [] };
  let round = -1;

  while (true) {
    round++;
    const card1 = await drawCard(deckId);
    const card2 = await drawCard(deckId);
    let roundResults: string = "";

    if (!card1 || !card2) {
      yield 'Not enough cards in the deck to continue the game.';
      return;
    }

    //text is encoded:
    // |c| = card values
    // |r| = result
    roundResults += `Round ${round}:`;
    roundResults += `|c|${player1.name}: ${card1.value} of ${card1.suit}`;
    roundResults += `|c|${player2.name}: ${card2.value} of ${card2.suit}`;

    if (card1.value > card2.value) {
      roundResults += `|r|${player1.name} wins the round!`;
      player1.deck.push(card1, card2);
    } else if (card2.value > card1.value) {
      roundResults += `|r|${player2.name} wins the round!`;
      player2.deck.push(card1, card2);
    } else {
      roundResults += "|r|It's a tie!";
    }

    if (round >= 100) {
      roundResults += "|r|Game Over";

      if (player1.deck.length > player2.deck.length) {
        roundResults += `|r|${player1.name} wins the game!`;
      } else if (player2.deck.length > player1.deck.length) {
        roundResults += `|r|${player2.name} wins the game!`;
      } else {
        roundResults += "|r|It's a tie!";
      }

      yield roundResults;
      return;
    }

    yield roundResults;
  }
}

export async function newGame(): Promise<string> {
  try {
    const deck = await createDeck();
    roundGenerator = playWarRound(deck);

    // Get the first message from the generator
    const firstMessage = await roundGenerator.next();

    return firstMessage.value;

  } catch (error) {
    throw new Error('Failed to start a new game.');
  }
}


export async function nextRound(): Promise<string> {

  const roundMessage = await roundGenerator.next();
  if (roundMessage.done) {
    return "This game is over";
  } else {
    return roundMessage.value;
  }

}

