import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import { getBreadcrumbFromSecond } from 'assets/admin';
import { saveSelectedKey } from 'pages/Admin/adminSlice';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import './BreadcrumbCustomv2.scss';

BreadcrumbCustomv2.propTypes = {

};

function BreadcrumbCustomv2(props) {
    const [paths, setPaths] = React.useState([]);
    const { pathname } = useLocation();
    const dispatch = useDispatch();

    React.useEffect(() => {
        const { paths: currentPaths, key } = getBreadcrumbFromSecond(pathname);
        setPaths(currentPaths);
        dispatch(saveSelectedKey({ key }));
    }, [pathname])

    return (
        <div className='breadcrumb-v2'>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to='/admin/dashboard'>
                        <HomeOutlined />
                    </Link>
                </Breadcrumb.Item>
                {
                    paths.map((path, idx) => <Breadcrumb.Item key={idx}>{path}</Breadcrumb.Item>)
                }
            </Breadcrumb>
            {/* <div className='name-page'>{paths[1] || paths[0]}</div> */}
        </div>
    );
}

export default BreadcrumbCustomv2;