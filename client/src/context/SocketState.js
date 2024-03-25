import React, { createContext, useEffect, useState } from 'react';
import { socket } from '../utils/socket';

export const SocketContext = createContext();
export default function SocketState({ children }) {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        socket.on("connect", () => {
            setIsConnected(true);
            console.log("Connected to the server");
        });
        socket.on("disconnect", () => {
            setIsConnected(false);
            console.log("Disconnected from the server");
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
        }
    }, []);

    return (
        <SocketContext.Provider value={{ isConnected }}>
            {children}
        </SocketContext.Provider>
    );
}