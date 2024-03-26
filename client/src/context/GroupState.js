import React, { createContext, useContext, useEffect, useState } from 'react';
import { SocketContext } from './SocketState';
import { socket } from '../utils/socket';
import { AuthContext } from './AuthState';

export const GroupContext = createContext();
export default function GroupState({ children }) {
    let { user } = useContext(AuthContext);
    let { isConnected } = useContext(SocketContext);

    const [newGroup, setNewGroup] = useState();
    const [newMessage, setNewMessage] = useState();

    const [newGroups, setNewGroups] = useState([]);
    const [newMessages, setNewMessages] = useState({});

    useEffect(() => {
        socket.on(`${user.userId}-new-group`, (data) => {
            setNewGroup(data);
        });
        socket.on(`${user.userId}-new-message`, (data) => {
            setNewMessage(data);
        });

        return () => {
            socket.off("new-group");
            socket.off("new-message");
        }
    }, [user, isConnected]);

    useEffect(() => {
        if (!newGroup) return;
        setNewGroups((prev) => [newGroup, ...prev]);
    }, [newGroup]);

    useEffect(() => {
        if (!newMessage) return;
        setNewMessages((prev) => ({ ...prev, [newMessage.groupId]: prev[newMessage.groupId] ? [...prev[newMessage.groupId], newMessage] : [newMessage] }));
    }, [newMessage]);

    return (
        <GroupContext.Provider value={{ newGroups, newMessages }}>
            {children}
        </GroupContext.Provider>
    )
}