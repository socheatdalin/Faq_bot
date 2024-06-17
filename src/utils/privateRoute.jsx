import React from 'react';
import { Route, Redirect, Navigate } from 'react-router-dom';
import { isAdminLoggedIn } from '../utils/auth';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        isAdminLoggedIn()
            ? <Component {...props} />
            : <Navigate to='/login' />
    )} />
);

export default PrivateRoute;
