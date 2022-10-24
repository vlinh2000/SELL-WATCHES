import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'components/Loader';
import './ButtonCustom.scss';

ButtonCustom.propTypes = {
    text: PropTypes.string,
    type: PropTypes.string,
    className: PropTypes.string,
    isLoading: PropTypes.bool,
    disabled: PropTypes.bool,
    style: PropTypes.object,
    onClick: PropTypes.func
};

ButtonCustom.defaultProps = {
    text: '',
    type: '',
    className: '',
    isLoading: false,
    disabled: false,
    style: {},
    onClick: null
};

function ButtonCustom(props) {
    const { text, isLoading, style, onClick, type, disabled, className } = props;

    const handleClick = () => {
        if (!onClick) return;
        onClick();
    }

    return (
        // <button disabled={disabled} onClick={handleClick} type={type} className={`button-custom ${className}`} style={style}>
        <button disabled={disabled} onClick={handleClick} type={type} className={`button-3 ${className}`} style={style}>
            <span>{props.children} </span> {isLoading && <Loader />}
        </ button>
    );
}

export default ButtonCustom;