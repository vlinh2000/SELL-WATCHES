import React from 'react';
import PropTypes from 'prop-types';
import './SortBy.scss';
import SelectField from 'custom-fields/SelectField';
import { useDispatch } from 'react-redux';
import { onSort } from 'pages/User/userSlice';

SortBy.propTypes = {

};

function SortBy(props) {
    const { label, options, name, style } = props;

    return (
        <div className='sortby'>
            <SelectField style={style}
                name={name}
                label={label}
                options={options} />
        </div>
    );
}

export default SortBy;