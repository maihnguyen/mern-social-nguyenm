import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import Home from './core/Home'
import Users from './user/Users'
import Signup from './user/Signup'
import Signin from './auth/Signin'
import EditProfile from './user/EditProfile'
import Profile from './user/Profile'
import PrivateRoute from './auth/PrivateRoute'
import Menu from './core/Menu'
import EventList from './event/EventList';
import Invitations from './event/Invitations'
import CreateEvent from './event/CreateEvent';
import EditEvent from './event/EditEvent';

const MainRouter = () => {
    return (<div>
      <Menu/>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/users" component={Users}/>
        <Route path="/signup" component={Signup}/>
        <Route path="/signin" component={Signin}/>
        <Route exact path="/events" component={EventList} />
        <Route path="/events/create" component={CreateEvent} />
        <Route path="/events/invitations" component={Invitations} />
        <Route path="/events/edit/:eventId" component={EditEvent} />
        <PrivateRoute path="/user/edit/:userId" component={EditProfile}/>
        <Route path="/user/:userId" component={Profile}/>
      </Switch>
    </div>)
}

export default MainRouter
