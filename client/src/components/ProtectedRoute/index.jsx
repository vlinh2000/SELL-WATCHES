import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

ProtectedRoute.propTypes = {

};

function ProtectedRoute({ isAllow, redirectPath = '/', children }) {

    return !isAllow ? <Navigate to={redirectPath} replace /> : children;
};

export default ProtectedRoute;