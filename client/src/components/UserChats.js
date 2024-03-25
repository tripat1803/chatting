import React, { useContext, useEffect, useState } from 'react';
import { IoMdSearch } from "react-icons/io";
import ChatCard from './cards/ChatCard';
import { AuthContext } from '../context/AuthState';
import { GroupContext } from '../context/GroupState';

export default function UserChats({ openGroup = () => { } }) {
    let { groups } = useContext(AuthContext);
    let { newGroups } = useContext(GroupContext);
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(groups);
    }, [groups]);

    useEffect(() => {
        setData((prev) => [...newGroups, ...prev]);
    }, [newGroups]);

    return (
        <div>
            <div className='py-1.5 px-2'>
                <div className='bg-[#202c33] flex gap-2 items-center rounded-md'>
                    <IoMdSearch size={20} className='text-[#788791] mx-4' />
                    <input className='flex-1 py-[0.45rem] bg-transparent text-white outline-none placeholder:text-[#788791] pr-4 text-sm placeholder:text-sm' placeholder='Search or start new chat' />
                </div>
            </div>
            <div>
                {
                    data.map((chat) => (
                        <ChatCard key={chat.groupId} handleClick={() => {
                            openGroup(chat);
                        }} name={chat.name} body={(chat.lastMessage.length === 0) ? `${chat.owner.owned ? "You" : chat.owner.firstname} created this group` : `${chat.owner.owned ? "You" : chat.owner.firstname}: ${chat.lastMessage[0].message}`} participants={chat.participants} />
                    ))
                }
            </div>
        </div>
    )
}