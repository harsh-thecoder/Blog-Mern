import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../Components/UserContext';

function LoginPage() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const {setUserInfo} = useContext(UserContext);

  async function login(e){
    e.preventDefault();
    const response = await fetch('http://localhost:4000/login', {
       method: 'POST',
       body: JSON.stringify({username,password}),
       headers: {'Content-Type':'application/json'},
       credentials: 'include',
    }) 
    if(response.ok)
    {
        response.json().then(userInfo => {
          setUserInfo(userInfo);
          setRedirect(true);
          console.log(userInfo)
        })

    }
    else
    {
       alert('Wrong Credentials');
    }
  }

  if(redirect){
      return <Navigate to = {'/'} />
  }
  

  return (
    <>
      <form className='Login' onSubmit={login}>
        <h1>Login</h1>
        <input type="text"
          placeholder='Username'
          value={username}
          onChange={e => setUsername(e.target.value)} />

        <input type="password"
          placeholder='Password'
          value={password}
          onChange={e => setPassword(e.target.value)} />

        <button>Login</button>
      </form>
    </>
  )
}

export default LoginPage
