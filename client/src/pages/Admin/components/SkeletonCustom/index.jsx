import React from 'react';
import PropTypes from 'prop-types';
import './SkeletonCustom.scss';
import { Skeleton } from 'antd';

SkeletonCustom.propTypes = {
    rows: PropTypes.number
};

SkeletonCustom.defaultProps = {
    rows: 10
};

function SkeletonCustom(props) {
    const { rows } = props;
    return (
        <div className='skeleton-custom'>
            <Skeleton paragraph={{ rows }} active title={false} />
        </div>
    );
}

export default SkeletonCustom;