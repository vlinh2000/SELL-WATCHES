import React from 'react';
import PropTypes from 'prop-types';
// import './UploadField.scss';
import { Form, Input, message, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

UploadField.propTypes = {
    name: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    showUploadList: PropTypes.bool,
    saveData: PropTypes.func,
    label: PropTypes.string,
    listType: PropTypes.string,
    onRemove: PropTypes.func,
    rules: PropTypes.array,
    defaultFileList: PropTypes.array,
};

UploadField.defaultProps = {
    name: '',
    disabled: false,
    required: false,
    showUploadList: false,
    saveData: null,
    label: '',
    listType: 'text',
    onRemove: null,
    rules: [],
    defaultFileList: [],
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

    const { name, disabled, saveData, label, listType, onRemove, required, getUrl, icon, showUploadList, rules, defaultFileList } = props;
    const [fileList, setFileList] = React.useState(() => defaultFileList || []);
    const [loading, setLoading] = React.useState(false);
    const [imageUrl, setImageUrl] = React.useState();

    const handleChange = async ({ file, fileList: newFileList }) => {
        if (getUrl) {
            const base64 = await getBase64(file);
            getUrl(base64);
        }

        setFileList(newFileList);
        handleSaveData([...newFileList]);
    };

    const handleRemove = (file) => {
        if (!onRemove) return;
        onRemove(file)
    }

    const handleSaveData = (fileList) => {
        if (!saveData) return;
        saveData(fileList)
        console.log({ fileList })
    }

    return (
        <Form.Item
            className='input-field'
            required={required}
            rules={rules}
            label={label}
            name={name}>
            <Upload
                onRemove={(file) => handleRemove(file)}
                fileList={fileList}
                listType={listType}
                name="avatar"
                className="avatar-uploader"
                showUploadList={showUploadList}
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