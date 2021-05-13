
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Players from "./views/players";

const App = () => {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" exact component={Players} />
        </Switch>
      </Router>
    </>
  )
}
export default App;