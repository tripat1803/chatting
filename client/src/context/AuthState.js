import React, { createContext, useEffect, useState } from 'react';
import { authAxios } from '../utils/api';

export const AuthContext = createContext();
export default function AuthState({ children }) {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState({});
  const [loader, setLoader] = useState(true);
  const [groupLoader, setGroupLoader] = useState(true);
  const [groups, setGroups] = useState([]);

  const onLogout = () => {
    localStorage.removeItem('chat-at');
    setAuth(false);
  }
  
  const onLogin = () => {
    setAuth(true);
  }

  const fetchUser = async () => {
    authAxios.get("/api/user").then((res) => {
      setAuth(true);
      setUser(res.data);
      setLoader(false);
    }).catch((err) => {
      setAuth(false);
      setLoader(false);
    });
  }

  const fetchGroups = async () => {
    setGroupLoader(true);
    authAxios.get("/api/group").then((res) => {
      setGroups(res.data.groups);
      setGroupLoader(false);
    }).catch((err) => {
      setGroupLoader(false);
    });
  }

  useEffect(() => {
    setLoader(true);
    let token = localStorage.getItem('chat-at');
    if (token) {
      setAuth(true);
    } else {
      setAuth(false);
      setLoader(false);
    }
  }, []);

  useEffect(() => {
    if (auth) {
      fetchUser();
      fetchGroups();
    }
  }, [auth]);

  const addGroup = (group) => {
    setGroups([group, ...groups]);
  }

  if (loader) {
    return <h1>Loading...</h1>
  }

  return (
    <AuthContext.Provider value={{ auth, onLogout, onLogin, user, groups, groupLoader, addGroup }}>
      {children}
    </AuthContext.Provider>
  )
}
