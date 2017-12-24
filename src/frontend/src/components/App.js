import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Dashboard from './Dashboard';
import Home from './Home'
import NotFound from './NotFound';
import Footer from './Footer';
import Header from './Header';
import Login from './Login';
import Signup from './Signup';
import Forgot from './Forgot';
import Reset from './Reset';

const App = () => (
  <div>
    <Header />
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/login' component={Login}/>
      <Route path='/signup' component={Signup}/>
      <Route path='/forgot' component={Forgot}/>
      <Route path='/reset/:token' name='hello' component={Reset}/>
      <Route path='/dashboard' component={Dashboard}/>
      <Route component={NotFound} status={404}/>
    </Switch>
    <Footer />
  </div>
)

export default App;
