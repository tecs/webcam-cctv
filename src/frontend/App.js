import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Dashboard from './components/Dashboard';
import Broadcast from './components/Broadcast';
import Home from './components/Home';

ReactDOM.render((
  <BrowserRouter>
    <Switch>
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/broadcast/:name?/:devices?" component={Broadcast} />
      <Route path="/" component={Home} />
    </Switch>
  </BrowserRouter>
), document.getElementById('app'));
