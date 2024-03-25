import React, { useEffect, useRef, useState } from 'react';
import TopNav from '../components/TopNav';
import UserChats from '../components/UserChats';
import CreateGroup from '../components/CreateGroup';
import ChatArea from '../components/ChatArea';


export default function Chat() {
    const [screen, setScreen] = useState('chats');
    const [group, setGroup] = useState(null);

    const screens = {
        "chats": <UserChats openGroup={(group) => {
            setGroup(group);
        }} />,
        "create-group": <CreateGroup goBack={() => setScreen("chats")} />,
    }

    return (
        <div className='h-screen flex flex-col justify-center items-center'>
            <div className='flex-1 w-full h-full flex'>
                <div className='bg-[#111b21] w-[40%] border-r border-[#313d45] relative flex flex-col'>
                    {(screen === "chats") && <TopNav createGroup={() => setScreen("create-group")} />}
                    {screens[screen]}
                </div>
                <div className='bg-[#222e35] flex flex-col flex-1'>
                    {
                        group && <ChatArea group={group} />
                    }
                </div>
            </div>
        </div>
    );
}