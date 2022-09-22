import React from 'react';
import PropTypes from 'prop-types';
import './InputEmoijField.scss';
import { Form, Input, InputNumber } from 'antd';
import InputEmoji from "react-input-emoji";

InputEmoijField.propTypes = {
    name: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    readOnly: PropTypes.bool,
    placeHolder: PropTypes.string,
    label: PropTypes.string,
    rules: PropTypes.array,
};

InputEmoijField.defaultProps = {
    name: '',
    disabled: false,
    required: false,
    readOnly: false,
    placeHolder: '',
    label: '',
    rules: [],
};

function InputEmoijField(props) {
    const { name, disabled, placeHolder, label, required, rules } = props;
    return (
        <Form.Item
            className='input-emoij-field'
            required={required}
            label={label}
            rules={rules}
            name={name}>
            <InputEmoji
                borderRadius={0}
                placeholder={placeHolder}
            />
        </Form.Item>
    );
}

export default InputEmoijField;