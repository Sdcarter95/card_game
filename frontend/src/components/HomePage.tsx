import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:3001',  { transports: ['websocket', 'polling', 'flashsocket'] }); // Connect to the WebSocket server
function HomePage() {

    const [gameMessage, setGameMessage] = useState<string>("Ready to play");
    const [drawMessage, setDrawMessage] = useState<string>("");
    const [opponentMessage, setOpponentMessage] = useState<string>("");
    const [turnStatus, setTurnStatus] = useState<string>("start");
    const [roundNumber, setRoundNumber] = useState<string>("start");

    useEffect(() => {

        // Listen for "endGame" event from the server
        socket.on('endGame', (message: string) => {
            setGameMessage(message);
        });

        //startGame();
    }, [])


    const playRound = () => {
        socket.emit('nextRound');
        setTurnStatus("wait");
    };

    
    // Listen for "waitingForPlayers" event from the server
    socket.on('waitingForPlayers', (message: string) => {
        setGameMessage(message); // Display the waiting message
    });

     // Listen for "gameStart" events from the server
     socket.on('gameStart', (result: string) => {
        setGameMessage(result); // Update the game message with the result
    });

    // Listen for "drawResult" events from the server
    socket.on('drawResult', (result: string) => {
        setDrawMessage(result); // Update the game message with the result
        setTurnStatus("wait");
    });

    // Listen for "opponentResult" events from the server
    socket.on('opponentResult', (result: string) => {
        setOpponentMessage(result); // Update the game message with the result
        setTurnStatus("Draw");
    });

    // Listen for "roundResult" events from the server
    socket.on('roundResult', (result: string) => {
        setGameMessage(result); // Update the game message with the result
        setTurnStatus("Draw");
    });

    
    socket.on('roundNumber', (result: string) => {
        setRoundNumber(result);
    });
    

    return (
        <>
          <div>
            <p>{roundNumber}</p>
            <p>{opponentMessage}</p>
            <p>{gameMessage}</p>
            <p>{drawMessage}</p>
            {turnStatus !== "wait" ? (
              <button onClick={playRound}>{turnStatus}</button>
            ) : (
              <p>Waiting...</p>
            )}
          </div>
        </>
      );
}


export default HomePage;
