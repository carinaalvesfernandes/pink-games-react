import React from "react";
import Navigation from "./Navigation";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
// När det är flera componeter från samma fil gör man så här. "As" syftar på element namnet du ger.
import Home from "./Home";
import Memory from "./memory"; // Nu riktar den till mappen memory och du behöver inte skriva index.js
import Snake from "./snake";
import Minesweeper from "./minesweeper";
import "./App.css";

/*
class App extends React.Component {
  render() {
    return <div>Hello world!</div>;
  }
}
// creating a component
function App() {
  return <div> Hello world </div>;
}
*/

// Root componet
function App() {
  return (
    <Router>
      <Navigation></Navigation>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/memory" component={Memory} />
        <Route path="/snake" component={Snake} />
        <Route path="/minesweeper" component={Minesweeper} />
      </Switch>
    </Router>
  );
}

export default App;
