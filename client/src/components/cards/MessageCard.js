import React from 'react';

export default function MessageCard({ message, owned, previousOwned, user }) {
    return (
        <div className={`flex w-full ${owned ? "justify-end" : "justify-start"} px-2 py-0.5 text-white`}>
            <div className={`w-[max-content] ${(!owned && !previousOwned) && "mt-1"} ${owned ? "bg-[#005c4b]" : "bg-[#202c33]"} px-3 py-0.5 rounded-md`}>
                {
                    !previousOwned && <p className='text-sm'>{!owned ? `~ ${user.firstname}` : "You"}</p>
                }
                <p>{message}</p>
            </div>
        </div>
    )
}
