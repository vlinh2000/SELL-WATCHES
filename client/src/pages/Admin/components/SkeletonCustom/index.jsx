import React from 'react';
import PropTypes from 'prop-types';
import './SkeletonCustom.scss';
import { Skeleton } from 'antd';

SkeletonCustom.propTypes = {

};

function SkeletonCustom(props) {
    return (
        <div className='skeleton-custom'>
            <Skeleton paragraph={{ rows: 10 }} active title={false} />
        </div>
    );
}

export default SkeletonCustom;