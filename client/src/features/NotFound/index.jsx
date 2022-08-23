import React from 'react';
import PropTypes from 'prop-types';
import { Button, Result } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

NotFound.propTypes = {

};

function NotFound(props) {

    const navigate = useNavigate();

    return (
        <Result
            status="403"
            title="403"
            subTitle="Không tìm thấy trang"
            extra={<Button onClick={() => navigate('/')} type="primary">Trở lại</Button>}
        />
    );
}

export default NotFound;