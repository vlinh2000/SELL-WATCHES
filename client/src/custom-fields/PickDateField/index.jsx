import React from 'react';
import PropTypes from 'prop-types';
import './PickDateField.scss';
import { DatePicker, Form, } from 'antd';

PickDateField.propTypes = {
    name: PropTypes.string,
    shouldUpdate: PropTypes.bool,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    readOnly: PropTypes.bool,
    showTime: PropTypes.bool,
    placeHolder: PropTypes.string,
    label: PropTypes.string,
    rules: PropTypes.array,
};

PickDateField.defaultProps = {
    name: '',
    shouldUpdate: false,
    disabled: false,
    required: false,
    readOnly: false,
    showTime: false,
    placeHolder: '',
    label: '',
    rules: [],
};

function PickDateField(props) {

    const { name, disabled, placeHolder, label, required, rules, shouldUpdate, showTime, picker } = props;

    return (
        <Form.Item
            shouldUpdate={shouldUpdate}
            className='pick-date-field'
            required={required}
            label={label}
            rules={rules}
            name={name}>
            <DatePicker picker={picker} showTime={showTime} disabled={disabled} placeholder={placeHolder} />
        </Form.Item>
    );
}

export default PickDateField;