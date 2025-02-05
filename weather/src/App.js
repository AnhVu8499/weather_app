import React, { useState } from 'react';
import './App.css';
import Main from './components/Main';

const App = () => {
  const [city, setCity] = useState('');
  return (
    <div className="App">
      <Main setCity={setCity} city={city} />
    </div>
  );
}

export default App;
