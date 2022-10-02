import React from 'react';
import PropTypes from 'prop-types';
import { selectVoucher, switch_voucherModal } from 'pages/User/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import SelectField from 'custom-fields/SelectField';
import { Button, Divider, Form, Modal, Popconfirm, Radio, Space, Table } from 'antd';
import { DeleteOutlined, EditOutlined, PlusSquareOutlined } from '@ant-design/icons';
import axios from 'axios';
import toast from 'react-hot-toast';
import { diachighApi } from 'api/diachighApi';
import Voucher from '../Voucher';
import { uudaiApi } from 'api/uudaiApi';

VoucherModal.propTypes = {
    addressList: PropTypes.array,
    onReload: PropTypes.func,
};

VoucherModal.defaultProps = {
    addressList: [],
    onReload: null,
};

function VoucherModal(props) {
    const { addressList: defaultList, onReload } = props;
    const { user, data: { myVouchers } } = useSelector(state => state.userInfo);
    const dispatch = useDispatch();
    const { isVisibleVoucherModal } = useSelector(state => state.userInfo)
    const [isLoading, setIsLoading] = React.useState(false);
    const [voucherList, setVoucherList] = React.useState([]);
    const [voucherSelected, setVoucherSelected] = React.useState('');

    // React.useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const { result } = await uudaiApi.getAll({});
    //             setVoucherList(result);
    //         } catch (error) {
    //             console.log({ error })
    //         }
    //     }

    //     fetchData();
    // }, [user])

    const handleChoose = () => {
        dispatch(selectVoucher(voucherSelected));
        dispatch(switch_voucherModal(false))
    }

    return (
        <div>
            {/* choose address modal */}
            <Modal
                width={500}
                title="Danh sách mã giảm giá"
                okText="OK"
                onOk={handleChoose}
                visible={isVisibleVoucherModal}
                onCancel={() => dispatch(switch_voucherModal(false))}>
                <Radio.Group onChange={({ target }) => setVoucherSelected(myVouchers[target.value])}>
                    <Space style={{ width: '100%' }} direction="vertical">
                        {
                            myVouchers?.map((voucher, idx) =>
                                <Radio disabled={voucher.SU_DUNG} key={idx} value={idx}><Voucher name={voucher.TEN_UU_DAI} used={voucher.SU_DUNG} id={voucher.MA_UU_DAI} expire={voucher.HSD} /></Radio>
                            )
                        }
                    </Space>
                </Radio.Group>
            </Modal>
        </div >
    );
}

export default VoucherModal;