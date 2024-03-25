import React, { useContext, useState } from 'react';
import { publicAxios } from '../utils/api';
import { AuthContext } from '../context/AuthState';

export default function Signin() {
    let { onLogin } = useContext(AuthContext);
    const [data, setData] = useState({
        providerId: "",
        password: ""
    });
    const [loader, setLoader] = useState(false);

    const handleSignin = () => {
        setLoader(true);
        publicAxios.post("/api/user", data).then((res) => {
            localStorage.setItem("chat-at", res.data.token);
            onLogin();
            setLoader(false);
        }).catch(() => {
            setLoader(false);
        })
    }

    return (
        <div className='flex justify-center items-center min-h-screen'>
            <div className='flex flex-col items-center w-[25%]'>
                <h1 className='text-2xl font-semibold mb-8'>Signin to chatapp</h1>
                <input value={data.providerId} onChange={(e) => setData((prev) => ({...prev, providerId: e.target.value}))} className='w-full outline-none border px-3 py-1 mb-2 rounded-md' placeholder='Email' type='text' />
                <input value={data.password} onChange={(e) => setData((prev) => ({...prev, password: e.target.value}))} className='w-full outline-none border px-3 py-1 mb-4 rounded-md' placeholder='Password' type='password' />
                <button disabled={loader} onClick={handleSignin} className='bg-[#017561] w-full px-3 py-1 text-white rounded-md'>Signin</button>
            </div>
        </div>
    )
}