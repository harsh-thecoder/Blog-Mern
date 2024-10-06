import React, { useState } from 'react';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // Corrected the typo here

  async function register(e) {
    e.preventDefault(); // To prevent default behaviour of html
     const response = await fetch('http://localhost:4000/register', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type' : 'application/json' },
      });
    
      if (response.status === 200)
      {
         alert('registration successfull');
      }
      else
      {
        alert('registration failed');
      }

  }

  return (
    <>
      <form className="Register" onSubmit={register}>
        <h1>Register</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Corrected the typo here
        />
        {/* // - not sumbitted (type) */}
        <button>Register</button> 
      </form>
    </>
  );
}

export default RegisterPage;
