import React from 'react';
import PropTypes from 'prop-types';
import './loader.scss';

Loader.propTypes = {
    type: PropTypes.number
};

Loader.defaultProps = {
    type: 2
};

function Loader(props) {
    const { type, color } = props;

    return (
        <span class="loader"></span>
    );
}

export default Loader;