import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'components/Loader';
import './ButtonCustom.scss';

ButtonCustom.propTypes = {

};

function ButtonCustom(props) {
    const { text, isLoading, style } = props;
    return (
        <button className='button-custom' style={style}>
            {text} {isLoading && <Loader />}
        </ button>
    );
}

export default ButtonCustom;