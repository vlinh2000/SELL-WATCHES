import { QuestionCircleOutlined } from '@ant-design/icons';
import { Divider, Empty, Modal, Radio, Space } from 'antd';
import { selectVoucher, switch_voucherModal } from 'pages/User/userSlice';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Voucher from '../Voucher';
import './VoucherModal.scss';

VoucherModal.propTypes = {
    addressList: PropTypes.array,
    onReload: PropTypes.func,
};

VoucherModal.defaultProps = {
    addressList: [],
    onReload: null,
};

function VoucherModal(props) {
    const { data: { myVouchers } } = useSelector(state => state.userInfo);
    const dispatch = useDispatch();
    const { isVisibleVoucherModal } = useSelector(state => state.userInfo)
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
        <div className='voucher-modal'>
            {/* choose address modal */}
            <Modal
                width={500}
                title="Danh sách mã giảm giá"
                okText="OK"
                onOk={handleChoose}
                visible={isVisibleVoucherModal}
                onCancel={() => dispatch(switch_voucherModal(false))}>
                {
                    (myVouchers?.length < 1 || !myVouchers) && <>
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />

                    </>
                }
                <Radio.Group className='voucher-list-choosen' onChange={({ target }) => setVoucherSelected(myVouchers[target.value])}>
                    <Space style={{ width: '100%' }} direction="vertical">
                        {
                            myVouchers?.map((voucher, idx) =>
                                <Radio disabled={voucher.SU_DUNG} key={idx} value={idx}><Voucher name={voucher.TEN_UU_DAI} used={voucher.SU_DUNG} id={voucher.MA_UU_DAI} expire={voucher.HSD} /></Radio>
                            )
                        }
                    </Space>
                </Radio.Group>
                <Divider />
                <div className='tips-get-voucher-wrapper'>
                    <div className='tips-get-voucher-wrapper__title'><QuestionCircleOutlined /> Mẹo nhận voucher của shop:</div>
                    <ol className='tips-get-voucher-wrapper__list'>
                        <li>Tham gia sự kiện săn voucher hàng tháng.</li>
                        <li>Mua hàng ủng hộ shop để có cơ hội được tặng ngẫu nhiên qua email.</li>
                        {/* <li>Nhắn anh Linh bên facebook để được trao tận tay.</li> */}
                    </ol>
                </div>
            </Modal>
        </div >
    );
}

export default VoucherModal;