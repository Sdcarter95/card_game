import React, { useEffect, useState } from 'react';
import { newGame, nextRound } from '../server_calls/WarCalls';

function HomePage() {

    const [gameMessage, setGameMessage] = useState<any>("Ready to play");

    useEffect(() => {
        startGame();
    }, [])

    const startGame = () => {
        newGame()
            .then((response: any) => {
                setGameMessage(response);
            })
            .catch((error: any) => {
                console.error("Error starting the game:", error);
                setGameMessage(error);
            });
    };

    const playRound = () => {
        nextRound().then((response: any) => {
            setGameMessage(response);
        })
            .catch((error: any) => {
                console.error("Error playing round:", error);
                setGameMessage(error);
            });
    };

    return (
        <>
            <div>
                <p>{gameMessage}</p>
                <button onClick={playRound}>Draw</button>
            </div>
        </>
    )
}


export default HomePage;
