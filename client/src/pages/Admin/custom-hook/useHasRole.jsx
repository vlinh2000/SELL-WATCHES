import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

useHasRole.propTypes = {

};

function useHasRole(props) {
    const { role } = props;
    const { data: { myRoles } } = useSelector(state => state.adminInfo);
    return null;
}

export default useHasRole;