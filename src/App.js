import React from 'react';
import './App.css';
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
      <Route path="/">
        <Wallet/>
      </Route>
    </Switch>
</BrowserRouter>
  );
}

export default App;
