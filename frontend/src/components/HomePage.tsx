import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import "./css/HomePage.css"

const socket: Socket = io('http://localhost:3001', { transports: ['websocket', 'polling', 'flashsocket'] });

function HomePage() {
    const [gameMessage, setGameMessage] = useState<string>('Ready to play');
    const [drawMessage, setDrawMessage] = useState<string>('');
    const [opponentMessage, setOpponentMessage] = useState<string>('');
    const [turnStatus, setTurnStatus] = useState<string>('start');
    const [roundNumber, setRoundNumber] = useState<string>('');

    useEffect(() => {
        // Listen for "endGame" event from the server
        socket.on('endGame', (message: string) => {
            setGameMessage(message);
        });

        // Listen for "waitingForPlayers" event from the server
        socket.on('waitingForPlayers', (message: string) => {
            setGameMessage(message);
        });

        // Listen for "gameStart" events from the server
        socket.on('gameStart', (result: string) => {
            setGameMessage(result);
        });

        // Listen for "drawResult" events from the server
        socket.on('drawResult', (result: string) => {
            setDrawMessage(result);
            setTurnStatus('wait');
        });

        // Listen for "opponentResult" events from the server
        socket.on('opponentResult', (result: string) => {
            setOpponentMessage(result);
            setTurnStatus('Draw');
        });

        // Listen for "roundResult" events from the server
        socket.on('roundResult', (result: string) => {
            setGameMessage(result);
            setTurnStatus('Draw');
        });

        // Updates the round number
        socket.on('roundNumber', (result: string) => {
            setRoundNumber(result);
        });
    }, []);

    const playRound = () => {
        socket.emit('nextRound');
        setTurnStatus('wait');
    };

    return (
        <>

            <div className="container">
                <h1 className="round-number">{roundNumber}</h1>
                <div className="opponent-message">{opponentMessage}</div>
                <div className="game-message">{gameMessage}</div>
                <div className="draw-message">{drawMessage}</div>
                {turnStatus !== 'wait' ? (
                    gameMessage !== 'Waiting for more players to join...' ? (
                        <button className="draw-button" onClick={playRound}>
                            {turnStatus}
                        </button>
                    ) : null
                ) : (
                    <p className="waiting-text">Waiting...</p>
                )}
            </div>
        </>
    );
}

export default HomePage;


