import React from 'react';
import { BsFillPersonFill } from 'react-icons/bs';

export default function ChatCard({ name="Testing", unread, handleClick=()=>{}, date, body="Hey, I am using Whatsapp", participants=[] }) {
    return (
        <div onClick={handleClick} className='flex gap-4 px-3 items-center hover:bg-[#202c33] cursor-pointer'>
            <span className='w-[50px] h-[50px] flex justify-center items-center bg-[#6a7175] rounded-full overflow-hidden pt-3'>
                <BsFillPersonFill size={50} className='text-[#cfd4d6]' />
            </span>
            <div className='flex flex-col flex-1 -gap-1 text-white border-b-[0.1px] py-2.5 border-[#8696a026]'>
                <div className='flex justify-between items-start'>
                    <p className='text-lg'>{name}</p>
                    {(date) && <p className={`${(unread && unread !== 0) ? "text-[#00a884] font-semibold" : "text-[#6a7175]"} text-xs`}>{(new Date()).toLocaleDateString()}</p>}
                </div>
                <div className='flex justify-between items-end'>
                    <p className={`flex-1 ${(unread && unread !== 0) ? "text-[#fff]" : "text-[#6a7175]"} text-sm`}>{body}</p>
                    {(unread && unread !== 0) && <span className='bg-[#00a884] rounded-full w-[20px] h-[20px] text-black flex justify-center items-center text-xs font-semibold'>1</span>}
                </div>
            </div>
        </div>
    );
}