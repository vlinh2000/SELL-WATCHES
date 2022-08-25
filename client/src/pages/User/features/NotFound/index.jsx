import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

function NotFound(props) {

    const navigate = useNavigate();

    return (
        <Result
            status="404"
            title="404"
            subTitle="Không tìm thấy trang"
            extra={<Button onClick={() => navigate('/')} type="primary">Trở lại</Button>}
        />
    );
}

export default NotFound;