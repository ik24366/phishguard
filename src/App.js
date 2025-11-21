import logo from './logo.svg';
import './App.css';
import React from 'react';
import AccessibleButton from './AccessibleButton';

function App() {
  return (
    <>
    <div>
      <h1>Welcome to PhishGuard</h1>
      <p>Phishing awareness training starts here.</p>
    </div>
    <div style={{ margin: '20px' }}>
      <h1>PhishGuard</h1>
      <AccessibleButton onPress={() => alert('Button pressed!')}>
        Click me accessibly
      </AccessibleButton>
    </div>
    </>
  );
}

export default App;
