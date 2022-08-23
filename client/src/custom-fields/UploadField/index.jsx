import React from 'react';
import PropTypes from 'prop-types';
// import './UploadField.scss';
import { Form, Input, message, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

UploadField.propTypes = {
    name: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    placeHolder: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    rows: PropTypes.number
};

UploadField.defaultProps = {
    name: '',
    disabled: false,
    required: false,
    placeHolder: '',
    label: '',
    type: 'text',
    rows: 10
};

const getBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});


const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }

    return false;
};

function UploadField(props) {

    const { name, disabled, placeHolder, label, type, rows, required, getUrl, icon } = props;

    const [loading, setLoading] = React.useState(false);
    const [imageUrl, setImageUrl] = React.useState();

    const handleChange = async (info) => {
        if (getUrl) {
            const base64 = await getBase64(info.file);
            getUrl(base64);
        }

    };

    return (
        <Form.Item
            className='input-field'
            required={required}
            label={label}
            name={name}>
            <Upload
                name="avatar"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleChange}>
                <div className='upload-avatar'>
                    {icon}
                </div>
            </Upload>
        </Form.Item>
    );
}

export default UploadField;