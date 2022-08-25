import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import { getBreadcrumbFromSecond } from 'assets/admin';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BreadcrumbCustomv2.scss';

BreadcrumbCustomv2.propTypes = {

};

function BreadcrumbCustomv2(props) {
    const [paths, setPaths] = React.useState([]);
    const { pathname } = useLocation();

    React.useEffect(() => {
        const currentPaths = getBreadcrumbFromSecond(pathname);
        setPaths(currentPaths);
        console.log({ currentPaths, pathname });
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
            <div className='name-page'>{paths[1] || paths[0]} {'> thêm' || '> sửa'}</div>
        </div>
    );
}

export default BreadcrumbCustomv2;