import React, { useContext } from 'react';
import { AuthContext } from './context/AuthState';
import AuthRoutes from './routes/AuthRoutes';
import UserRoutes from './routes/UserRoutes';

function App() {
  let { auth } = useContext(AuthContext);
  return auth ? <UserRoutes /> : <AuthRoutes />;
}

export default App;