import React, { useContext, useEffect, useState } from 'react';
import { BsFillPersonFill } from 'react-icons/bs';
import { IoArrowBackOutline } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import ChatCard from './cards/ChatCard';
import { authAxios } from '../utils/api';
import { AuthContext } from '../context/AuthState';
import { socket } from '../utils/socket';

function SelectedUser({ name, handleCancel = () => { } }) {
    return (
        <div className='flex items-center gap-1.5'>
            <span className='w-[24px] h-[24px] flex justify-center items-center bg-[#6a7175] rounded-full overflow-hidden pt-1.5'>
                <BsFillPersonFill size={24} className='text-[#cfd4d6]' />
            </span>
            <p className='text-[0.8rem]'>{name}</p>
            <div className='hover:bg-white rounded-full text-[#8696a0] cursor-pointer w-[18px] h-[18px] flex justify-center items-center'>
                <IoIosClose onClick={handleCancel} size={24} />
            </div>
        </div>
    )
}

export default function CreateGroup({ goBack = () => { } }) {
    let { addGroup } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loader, setLoader] = useState(false);
    const [name, setName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [buttonLoader, setByttonLoader] = useState(false);

    const fetchUsers = async () => {
        setLoader(true);
        authAxios.get("/api/user/all").then((res) => {
            setUsers(res.data.users);
            setLoader(false);
        }).catch((err) => {
            console.log(err);
            setLoader(false);
        });
    }

    const handleCreate = () => {
        setByttonLoader(true);
        authAxios.post("/api/group", {
            name: name,
            participants: selectedUsers
        }).then((res) => {
            socket.emit("new-group", res.data.group);
            addGroup(res.data.group);
            goBack();
            setByttonLoader(false);
        }).catch((err) => {
            setByttonLoader(false);
        });
    
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className='text-[#d9dee0] flex flex-col h-screen'>
            <div className='bg-[#202c33] px-4 py-3 text-xl font-semibold text-[#d9dee0] flex items-center gap-4 h-[max-content]'>
                <IoArrowBackOutline className='cursor-pointer' onClick={goBack} />
                <p>Create group</p>
            </div>
            <div className='px-8 flex flex-col gap-4 mt-6'>
                <input value={name} onChange={(e) => {
                    setName(e.target.value);
                }} className='w-full border-b-[0.1px] border-[#8696a026] px-0.5 pb-[0.2rem] text-sm placeholder:text-sm bg-transparent outline-none' type='text' placeholder='Enter name for the group' />
                <div className='flex flex-col gap-2'>
                    <div className='flex flex-wrap gap-1 max-h-[250px] overflow-y-scroll remove-scroll'>
                        {
                            selectedUsers.map((user, index) => (
                                <SelectedUser handleCancel={() => {
                                    setSelectedUsers([...selectedUsers.slice(0, index), ...selectedUsers.slice(index + 1)]);
                                    setUsers([user, ...users]);
                                }} key={user.firstname} name={user.firstname} />
                            ))
                        }
                    </div>
                    <input className='w-full border-b-[0.1px] border-[#8696a026] px-0.5 pb-[0.2rem] text-sm placeholder:text-sm bg-transparent outline-none' placeholder={(selectedUsers.length === 0) ? 'Search name or email' : ''} />
                </div>
            </div>
            <div className='flex-1 overflow-y-scroll mt-6'>
                <div className='flex flex-col'>
                    {
                        users.map((user, index) => {
                            return <ChatCard key={user.firstname} handleClick={() => {
                                setSelectedUsers([...selectedUsers, user]);
                                setUsers([...users.slice(0, index), ...users.slice(index + 1)]);
                            }} name={user.firstname} />
                        })
                    }
                </div>
            </div>
            {((selectedUsers.length !== 0) && (name !== "")) && <div className='py-4 flex justify-center items-center'>
                <button disabled={buttonLoader} onClick={handleCreate} className='bg-[#00a884] rounded-full pt-1 pb-1.5 px-6'>Create</button>
            </div>}
        </div>
    )
}