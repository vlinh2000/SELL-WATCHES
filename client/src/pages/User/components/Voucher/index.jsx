import React from 'react';
import PropTypes from 'prop-types';
import './Voucher.scss';
import { Button, Col, Row, Tag } from 'antd';
import { CheckCircleOutlined, TagsOutlined } from '@ant-design/icons';
import moment from 'moment';
import { user_uudaiApi } from 'api/user_uudaiApi';
import { useDispatch } from 'react-redux';
import { fetch_my_vouchers } from 'pages/User/userSlice';
import toast from 'react-hot-toast';

Voucher.propTypes = {
    mode: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    expire: PropTypes.string,
    isSaved: PropTypes.bool,
    saveAvailable: PropTypes.bool,
    used: PropTypes.bool,
};
Voucher.defaultProps = {
    mode: 'refer',
    id: '',
    name: '',
    expire: '',
    isSaved: false,
    saveAvailable: false,
    used: false,
};

function Voucher(props) {
    const { mode, id, name, expire, isSaved, saveAvailable, used } = props;
    const dispatch = useDispatch();
    const handleSave = async () => {
        try {
            if (!saveAvailable) return toast.error('Chỉ áp dụng đối với khách hàng đã từng đặt hàng trên web.')
            await user_uudaiApi.post({ MA_UU_DAI: id });
            dispatch(fetch_my_vouchers());
        } catch (error) {
            console.log({ error })
        }
    }

    return (
        <div className='voucher'>
            <div className="voucher-top">
                <TagsOutlined />
            </div>
            <div className="voucher-body">
                <div className='name'>{name} {used ? <small>(đã dùng)</small> : ''}</div>
                <div className='code'>Mã: {id}</div>
                <div className='description'>HSD: {expire && moment(expire).format('DD-MM-YYYY HH:mm:ss')}</div>
            </div>
            {
                mode !== 'refer' &&
                <div className="voucher-bottom">
                    <Tag onClick={!isSaved && handleSave} color={isSaved ? '#87d068' : '#c89979'} style={{ cursor: 'pointer' }}>{isSaved ? <span><CheckCircleOutlined />&nbsp;Đã lưu</span> : 'Lưu'}</Tag>
                </div>
            }
        </div>
    );
}

export default Voucher;