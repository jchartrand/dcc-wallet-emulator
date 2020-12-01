import React from 'react';
import './App.css';
import Verify from './pages/Verify'
import Wallet from './pages/Wallet'
 
import {
  BrowserRouter,
  Switch,
  Route
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
    <Switch>
      <Route path="/verify">
        <Verify/>
      </Route>
      <Route path="/wallet">
        <Wallet/>
      </Route>
      <Route path="/">
        <Wallet/>
      </Route>
    </Switch>
</BrowserRouter>
  );
}

export default App;
