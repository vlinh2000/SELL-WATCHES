import React from 'react';
import PropTypes from 'prop-types';
import './InputField.scss';
import { Form, Input } from 'antd';
import TextArea from 'antd/lib/input/TextArea';

InputField.propTypes = {
    name: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    placeHolder: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    rows: PropTypes.number
};

InputField.defaultProps = {
    name: '',
    disabled: false,
    required: false,
    placeHolder: '',
    label: '',
    type: 'text',
    rows: 10
};

function InputField(props) {

    const { name, disabled, placeHolder, label, type, rows, required } = props;

    return (
        <Form.Item
            className='input-field'
            required={required}
            label={label}
            name={name}>
            {
                type !== 'textarea' ? <Input type={type} placeholder={placeHolder} disabled={disabled} /> : <TextArea placeholder={placeHolder} disabled={disabled} rows={rows} />
            }

        </Form.Item>
    );
}

export default InputField;