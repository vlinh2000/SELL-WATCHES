import React from 'react';
import PropTypes from 'prop-types';
import './CheckField.scss';
import { Checkbox, Form, Input, InputNumber, Radio, Space } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { array } from 'yup/lib/locale';

CheckField.propTypes = {
    name: PropTypes.string,
    shouldUpdate: PropTypes.bool,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    readOnly: PropTypes.bool,
    placeHolder: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    direction: PropTypes.string,
    rows: PropTypes.number,
    rules: PropTypes.array,
    onChange: PropTypes.func,
    min: PropTypes.number,
    options: PropTypes.array,
    style: PropTypes.object,
};

CheckField.defaultProps = {
    name: '',
    shouldUpdate: false,
    disabled: false,
    required: false,
    readOnly: false,
    placeHolder: '',
    label: '',
    type: 'check-box',
    direction: 'horizontal',
    rows: 10,
    rules: [],
    onChange: null,
    min: 1,
    options: [],
    style: {},
};

function CheckField(props) {

    const { layout, style, name, disabled, placeHolder, direction, label, type, rows, required, rules, readOnly, onChange, shouldUpdate, min, options } = props;

    const handleChange = ({ target }) => {
        if (!onChange) return;
        onChange(target.value);
    }

    return (
        <Form.Item
            shouldUpdate={shouldUpdate}
            className='check-field'
            required={required}
            label={label}
            rules={rules}
            name={name}>
            {
                type === 'radio-box' ?
                    <Radio.Group
                        onChange={handleChange}>
                        <Space direction={direction}>
                            {options?.map((option, idx) => <Radio value={option.value} disabled={option.disabled} key={idx}>{option.label}</Radio>)}
                        </Space>
                    </Radio.Group>
                    : <Checkbox.Group
                        onChange={handleChange}>
                        <Space direction={direction}>
                            {options?.map((option, idx) => <Checkbox value={option.value} disabled={option.disabled} key={idx}>{option.label}</Checkbox>)}
                        </Space>
                    </Checkbox.Group>
            }
        </Form.Item>
    );
}

export default CheckField;