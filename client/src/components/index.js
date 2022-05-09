import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const Home = () => {
  const [response, setResponse] = useState('');

  const socket = io('http://localhost:4000');

  useEffect(() => {
    socket.on('message', (data) => {
      setResponse(data);
    });
  }, []);

  useEffect(() => {});
  return (
    <div>
      here is the : {response}
      <input />
    </div>
  );
};

export default Home;
