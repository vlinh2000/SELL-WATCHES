import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

ScrollTop.propTypes = {

};

function ScrollTop(props) {
    const location = useLocation();
    React.useEffect(() => {
        document.querySelector('.App').scrollIntoView({ behavior: 'smooth' });
    }, [location])

    return null
}

export default ScrollTop;