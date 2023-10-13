import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Importation de composants


function Routing() {
  return (
    <Router>
      <div>
        {/* Navigation*/}
        
        <Switch>
          <Route exact path="/"  />
          
        
          {/* La route pour gérer les 404. */}
          <Route  />
        </Switch>
      </div>
    </Router>
  );
}

export default Routing;
