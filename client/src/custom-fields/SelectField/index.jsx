import React from 'react';
import PropTypes from 'prop-types';
import './SelectField.scss';
import { Form, Select } from 'antd';

SelectField.propTypes = {
    name: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    placeHolder: PropTypes.string,
    label: PropTypes.string,
    style: PropTypes.object,
    options: PropTypes.array
};

SelectField.defaultProps = {
    name: '',
    disabled: false,
    required: false,
    placeHolder: '',
    label: '',
    style: {},
    options: []
};

function SelectField(props) {

    const { name, disabled, placeHolder, label, required, options, style } = props;

    return (
        <Form.Item
            className='select-field'
            required={required}
            label={label}
            name={name}>
            <Select defaultValue={options.length > 0 && options[0]?.value} style={style} options={options} />
        </Form.Item>
    );
}

export default SelectField;