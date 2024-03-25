import React, { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '../utils/socket';
import { AuthContext } from './AuthState';

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
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            setIsConnected(false);
        }
    }, []);

    return (
        <SocketContext.Provider value={{ isConnected }}>
            {children}
        </SocketContext.Provider>
    );
}