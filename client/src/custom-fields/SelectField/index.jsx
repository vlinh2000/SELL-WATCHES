import React from 'react';
import PropTypes from 'prop-types';
import './SelectField.scss';
import { Form, Select } from 'antd';

SelectField.propTypes = {
    name: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    placeHolder: PropTypes.string,
    mode: PropTypes.string,
    label: PropTypes.string,
    style: PropTypes.object,
    labelInValue: PropTypes.bool,
    options: PropTypes.array,
    rules: PropTypes.array,
    onChange: PropTypes.func,
    defaultValues: PropTypes.string,
};

SelectField.defaultProps = {
    name: '',
    disabled: false,
    required: false,
    labelInValue: false,
    placeHolder: '',
    mode: '',
    label: '',
    style: {},
    options: [],
    rules: [],
    onChange: null,
    defaultValues: '',
};

function SelectField(props) {

    const { name, disabled, placeHolder, label, required, options, style, labelInValue, mode, rules, onChange, defaultValues } = props;

    return (
        <Form.Item
            className='select-field'
            required={required}
            label={label}
            rules={rules}
            name={name}>
            <Select disabled={disabled} onChange={onChange} mode={mode} labelInValue={labelInValue} style={style} options={options} />
        </Form.Item>
    );
}

export default SelectField;