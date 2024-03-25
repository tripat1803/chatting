import React from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";
import { BsFillPersonFill } from "react-icons/bs";
import { MdOutlineAddToPhotos } from "react-icons/md";

export default function TopNav({ createGroup=()=>{} }) {
    return (
        <div className='bg-[#202c33] px-4 py-3 flex items-center justify-between'>
            <span className='w-[38px] h-[38px] flex justify-center items-center bg-[#6a7175] rounded-full overflow-hidden pt-2.5'>
                <BsFillPersonFill size={38} className='text-[#cfd4d6]' />
            </span>
            <div className='flex items-center gap-4'>
                <MdOutlineAddToPhotos onClick={createGroup} size={20} className='text-[#cfd4d6] cursor-pointer' />
                <BsThreeDotsVertical size={20} className='text-[#cfd4d6] cursor-pointer' />
            </div>
        </div>
    )
}