import React from 'react';
import PropTypes from 'prop-types';
import './Title.scss';

Title.propTypes = {

};

function Title(props) {
    const { animation } = props;

    return (
        <div data-aos={animation || ''} className='title'>
            <h2>
                {props.children}
            </h2>
        </div>
    );
}

export default Title;