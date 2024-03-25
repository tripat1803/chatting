import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Signin from '../pages/Signin';

export default function AuthRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Signin />} />
        </Routes>
    );
}