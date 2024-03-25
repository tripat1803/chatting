import React, { useContext, useEffect, useRef, useState } from 'react';
import { BsFillPersonFill } from 'react-icons/bs';
import { IoSend } from "react-icons/io5";
import { authAxios } from '../utils/api';
import { AuthContext } from '../context/AuthState';
import MessageCard from './cards/MessageCard';
import { GroupContext } from '../context/GroupState';
import { socket } from '../utils/socket';

export default function ChatArea({ group }) {
    let { user } = useContext(AuthContext);
    let { newMessages } = useContext(GroupContext);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [buttonLoader, setButtonLoader] = useState(false);
    const [loader, setLoader] = useState(false);
    let scrollRef = useRef();
    let chatDataRef = useRef();

    const scrollToBottom = () => {
        scrollRef.current.scrollTo(0, chatDataRef.current.scrollHeight);
    }

    const handleSend = () => {
        if (buttonLoader) return;
        if (message === '') return;
        setButtonLoader(true);
        authAxios.post("/api/message", {
            groupId: group.groupId,
            message,
            type: "text"
        }).then((res) => {
            socket.emit("new-message", {
                ...res.data.message,
                participants: group.participants
            });
            scrollToBottom();
            setMessages([res.data.message, ...messages]);
            setMessage('');
            setButtonLoader(false);
        }).catch(() => {
            setButtonLoader(false);
        })
    }

    const fetchMessages = () => {
        setLoader(true);
        authAxios.get(`/api/message/${group.groupId}`).then((res) => {
            setMessages(res.data.messages);
            scrollToBottom();
            setLoader(false);
        }).catch(() => {
            setLoader(false);
        });
    }

    useEffect(() => {
        fetchMessages();
    }, [group]);

    useEffect(() => {
        if (!newMessages) return;
        if (newMessages[group.groupId]) {
            setMessages((prev) => [newMessages[group.groupId][newMessages[group.groupId].length - 1], ...prev]);
            scrollToBottom();
        }
    }, [newMessages]);

    return (
        <div className='flex flex-col flex-1 h-full'>
            <div className='bg-[#202c33] px-4 py-3 flex items-center gap-4 cursor-pointer h-[max-content]'>
                <span className='w-[38px] h-[38px] flex justify-center items-center bg-[#6a7175] rounded-full overflow-hidden pt-2.5'>
                    <BsFillPersonFill size={38} className='text-[#cfd4d6]' />
                </span>
                <div>
                    <p className='text-white font-semibold duration-400'>{group.name}</p>
                    {/* <p className='text-[#8696a0] text-xs'>hello</p> */}
                </div>
            </div>
            <div ref={scrollRef} className='flex-1 overflow-y-scroll bg-[#0b141a] flex flex-col'>
                <div className='w-full flex-1 flex items-end'>
                    <div ref={chatDataRef} className='py-2 flex-1 flex flex-col justify-end'>
                        {
                            (messages && messages.length !== 0) && messages.map((data, index) => {
                                let msg = messages[messages.length - index - 1];
                                return (
                                    <MessageCard key={msg.messageId} user={msg.user} message={msg.message} owned={msg.user.userId === user.userId} previousOwned={(index !== 0) && (messages[messages.length - 1 -index].user.userId === messages[messages.length - index].user.userId)} />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <div className='bg-[#202c33] py-3 px-4 flex items-center gap-4 h-[max-content]'>
                <input onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSend();
                    }
                }} value={message} onChange={(e) => {
                    setMessage(e.target.value);
                }} type='text' placeholder='Type a message' className='outline-none border-none bg-[#2a3942] flex-1 py-1.5 px-3 placeholder:text-[#8696a0] text-[#8696a0] rounded-md' />
                <IoSend onClick={handleSend} size={26} className='text-[#8696a0]' />
            </div>
        </div>
    );
}