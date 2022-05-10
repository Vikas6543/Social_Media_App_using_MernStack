import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const Home = () => {
  const [text, setText] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:4000');
  }, []);

  return (
    <div>
      <input
        className='border'
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      <button>Login</button>
    </div>
  );
};

export default Home;
