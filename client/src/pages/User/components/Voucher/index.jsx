import React from 'react';
import PropTypes from 'prop-types';
import './Voucher.scss';
import { Button, Col, Row, Tag } from 'antd';
import { CheckCircleOutlined, TagsOutlined } from '@ant-design/icons';
import moment from 'moment';
import { user_uudaiApi } from 'api/user_uudaiApi';
import { useDispatch } from 'react-redux';
import { fetch_my_vouchers } from 'pages/User/userSlice';

Voucher.propTypes = {
    mode: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    expire: PropTypes.string,
    isSaved: PropTypes.bool,
};
Voucher.defaultProps = {
    mode: 'refer',
    id: '',
    name: '',
    expire: '',
    isSaved: false,
};

function Voucher(props) {
    const { mode, id, name, expire, isSaved } = props;
    const dispatch = useDispatch();
    const handleSave = async () => {
        try {
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
                <div className='name'>{name}</div>
                <div className='code'>Mã: {id}</div>
                <div className='description'>HSD: {expire && moment(expire).format('DD-MM-YYYY')}</div>
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