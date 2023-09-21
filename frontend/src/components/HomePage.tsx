import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:3001',  { transports: ['websocket', 'polling', 'flashsocket'] }); // Connect to the WebSocket server
function HomePage() {

    const [gameMessage, setGameMessage] = useState<any>("Ready to play");

    useEffect(() => {

        // Listen for "endGame" event from the server
        socket.on('endGame', (message: string) => {
            setGameMessage(message);
        });

        //startGame();
    }, [])


    const playRound = () => {
        socket.emit('nextRound');
    };

    // Listen for "waitingForPlayers" event from the server
    socket.on('waitingForPlayers', (message: string) => {
        setGameMessage(message); // Display the waiting message
    });

    // Listen for "roundResult" events from the server
    socket.on('roundResult', (result: string) => {
        setGameMessage(result); // Update the game message with the result
    });

    // Listen for "gameStart" events from the server
    socket.on('gameStart', (result: string) => {
        setGameMessage(result); // Update the game message with the result
    });

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
