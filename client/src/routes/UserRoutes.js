import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Chat from '../pages/Chat';
import GroupState from '../context/GroupState';

export default function UserRoutes() {
  return (
    <GroupState>
      <Routes>
        <Route path='/' element={<Chat />} />
      </Routes>
    </GroupState>
  )
}