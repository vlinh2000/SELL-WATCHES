import React from 'react';
import PropTypes from 'prop-types';
import './FeedBackList.scss';
import { CheckCircleOutlined, DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined } from '@ant-design/icons';
import { Avatar, Button, Comment, Rate, Tooltip } from 'antd';
import moment from 'moment';
import FeedBack from '../FeedBack';

FeedBackList.propTypes = {

};

function FeedBackList(props) {

    return (
        <ul className='feedback-list'>
            {/* <p>Hiện chưa có đánh giá nào</p> */}
            <FeedBack />
            <FeedBack />
            <FeedBack />
            <FeedBack />
        </ul>
    );
}

export default FeedBackList;