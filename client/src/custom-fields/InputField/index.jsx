import React from 'react';
import PropTypes from 'prop-types';
import './InputField.scss';
import { Form, Input, InputNumber } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { array } from 'yup/lib/locale';

InputField.propTypes = {
    name: PropTypes.string,
    shouldUpdate: PropTypes.bool,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    readOnly: PropTypes.bool,
    placeHolder: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    rows: PropTypes.number,
    rules: PropTypes.array,
    onChange: PropTypes.func,
    min: PropTypes.number,
    dependencies: array,
};

InputField.defaultProps = {
    name: '',
    shouldUpdate: false,
    disabled: false,
    required: false,
    readOnly: false,
    placeHolder: '',
    label: '',
    type: 'text',
    rows: 10,
    rules: [],
    onChange: null,
    min: 1,
    dependencies: [],
};

function InputField(props) {

    const { name, disabled, placeHolder, label, type, rows, required, rules, readOnly, onChange, shouldUpdate, min, dependencies } = props;

    const handleChange = ({ target }) => {
        if (!onChange) return;
        onChange(target.value);
    }

    return (
        <Form.Item
            dependencies={dependencies}
            shouldUpdate={shouldUpdate}
            className='input-field'
            required={required}
            label={label}
            rules={rules}
            name={name}>
            {
                type !== 'textarea' ?
                    type != 'number' ? <Input onChange={handleChange} readOnly={readOnly} type={type} placeholder={placeHolder} disabled={disabled} />
                        : <InputNumber min={min} readOnly={readOnly} type={type} placeholder={placeHolder} disabled={disabled} />
                    : <TextArea placeholder={placeHolder} disabled={disabled} rows={rows} />
            }

        </Form.Item>
    );
}

export default InputField;