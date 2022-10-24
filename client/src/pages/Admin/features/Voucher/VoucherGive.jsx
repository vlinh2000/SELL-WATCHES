import React from 'react';
import PropTypes from 'prop-types';
import SelectField from 'custom-fields/SelectField';
import { Avatar, Checkbox, Col, Form, Radio, Row, Select, Space } from 'antd';
import ButtonCustom from 'components/ButtonCustom';
import InputField from 'custom-fields/InputField';
import './VoucherGive.scss';
import * as yup from 'yup';
import { nguoidungApi } from 'api/nguoidungApi';
import { uudaiApi } from 'api/uudaiApi';
import toast from 'react-hot-toast';
import { user_uudaiApi } from 'api/user_uudaiApi';
import Voucher from 'pages/User/components/Voucher';
import moment from 'moment';


VoucherGive.propTypes = {

};
let schema = yup.object().shape({
    OPT_DS_USER: yup.string().required('Chưa chọn đối tượng nhận ưu đãi.'),
    // NOI_DUNG: yup.string().required('Nội dung không được để trống.'),
    DS_VOUCHER: yup.array().min(1, 'Chưa chọn voucher.'),
});

const yupSync = {
    async validator({ field }, value) {
        await schema.validateSyncAt(field, { [field]: value });
    },
};
const plainOptions = ['Apple', 'Pear', 'Orange'];
function VoucherGive(props) {
    const [isChooseGroupUser, setIsChooseGroupUser] = React.useState(false);
    const [options_users, setOptions_users] = React.useState([]);
    const [options_vouchers, setOptions_vouchers] = React.useState([]);
    const [voucherList, setVoucherList] = React.useState([]);

    const [isLoading, setIsLoading] = React.useState(false);
    const [moreContent, setMoreContent] = React.useState('');
    const [form] = Form.useForm();
    const handleGiveVoucher = async values => {
        try {
            setIsLoading(true);
            const data = {
                action: 'give-voucher',
                OPT_DS_USER: values.OPT_DS_USER,
                DS_USER: values.DS_USER,
                NOI_DUNG: values.NOI_DUNG,
                DS_VOUCHER: values.DS_VOUCHER
            }
            const { message } = await user_uudaiApi.post(data);
            setIsLoading(false);
            form.resetFields();
            setIsChooseGroupUser(false);
            toast.success(message);
            setMoreContent('');
            setVoucherList([]);

        } catch (error) {
            setIsLoading(false);
            console.log({ error })
            toast.error(error.response.data.message);
        }
    }
    const initialValues = {
        OPT_DS_USER: 'allUser',
        NOI_DUNG: '',
        DS_VOUCHER: []
    }

    React.useEffect(() => {
        const fetchAllUser = async () => {
            try {
                const { result } = await nguoidungApi.getAll();
                setOptions_users(result);
            } catch (error) {
                console.log({ error })
            }
        }

        fetchAllUser()
    }, [])

    React.useEffect(() => {
        const fetchAllVoucher = async () => {
            try {
                const { result } = await uudaiApi.getAll();
                setOptions_vouchers(result);
            } catch (error) {
                console.log({ error })
            }
        }

        fetchAllVoucher()
    }, [])

    console.log({ moreContent })

    const handleChooseVoucher = (vouchers) => {

        const vouchersSelected = vouchers.map(v => {
            const voucher = JSON.parse(v);
            return `Voucher ${voucher.TEN_UU_DAI} ~ HSD:${moment(voucher.HSD).format('DD-MM-YYYY HH:mm:ss')}`;
        })
        setVoucherList(vouchersSelected);
    }

    return (
        <div className='voucher-give box'>
            <Form
                form={form}
                initialValues={initialValues}
                layout='vertical'
                onFinish={(values) => handleGiveVoucher(values)}>
                <Row gutter={[40, 0]} justify="space-between">
                    <Col xs={24} sm={13} >
                        <Form.Item className='check-field' label="Nhóm đối tượng:" name="OPT_DS_USER" rules={[yupSync]}>
                            <Radio.Group onChange={({ target }) => setIsChooseGroupUser(target.value === 'group')}>
                                <Space direction="vertical">
                                    <Radio value='allUser'>Tất cả khách hàng</Radio>
                                    <Radio value='group'>Theo danh sách chỉ định</Radio>
                                </Space>
                            </Radio.Group>
                        </Form.Item>
                        {
                            isChooseGroupUser &&
                            <Form.Item
                                label="Danh sách khách hàng:"
                                className='select-field'
                                rules={[{ required: isChooseGroupUser, message: "Chưa chọn người dùng" }]}
                                name="DS_USER">
                                <Select
                                    mode="multiple"
                                    allowClear
                                    placeholder="-- Chọn người dùng --">
                                    {
                                        options_users?.map((user) =>
                                            <Select.Option key={user.USER_ID} value={JSON.stringify({ USER_ID: user.USER_ID, EMAIL: user.EMAIL })}><Avatar size="small" src={user.ANH_DAI_DIEN}>{user.ANH_DAI_DIEN ? '' : user.HO_TEN.charAt(0).toUpperCase()}</Avatar>&nbsp;{user.HO_TEN}</Select.Option>
                                        )
                                    }
                                </Select>
                            </Form.Item>
                        }
                        <InputField
                            label='Nội dung:'
                            onChange={value => setMoreContent(value)}
                            name='NOI_DUNG' type='textarea' rows={5} placeHolder='-- Nhập nội dung, lí do tặng voucher -- ' />
                        <br />
                        <Form.Item
                            className='check-field'
                            rules={[yupSync]}
                            label="Chọn voucher:" name="DS_VOUCHER">
                            {/* <Checkbox.Group options={options_vouchers} /> */}
                            <Checkbox.Group className='checkbox-custom' onChange={handleChooseVoucher} >
                                <Row className='voucher-list-choosen'>
                                    {
                                        options_vouchers?.map((voucher, idx) =>
                                            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                                                <Checkbox style={{ width: '100%' }} disabled={voucher.SU_DUNG} key={idx} value={JSON.stringify(voucher)}>
                                                    <Voucher quantity={voucher.SO_LUONG_BAN_DAU} name={voucher.TEN_UU_DAI} used={voucher.SU_DUNG} id={voucher.MA_UU_DAI} expire={voucher.HSD} />
                                                </Checkbox>
                                            </Col>
                                        )
                                    }
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={11} >
                        <div className='view-template'>
                            <label className='view-template__title'>Mail hiển thị:</label>
                            <div className='view-template__content'>

                                <div class="wrapper-mail">
                                    <div class="header">
                                        <img class="logo"
                                            src="https://res.cloudinary.com/vlinh/image/upload/v1664697926/images-tieuluan/logo_qezu3u.png" />
                                    </div>
                                    <div class="main">
                                        <h4>Mona Store xin chào,</h4>
                                        <div className='main-content'>
                                            Hiện tại cửa hàng đang có chương trình tặng voucher khuyến mãi để tri ân khách hàng Quý khách là một
                                            trong những khách hàng thân thiết đặc biệt của chúng tôi.<br />
                                            Cửa hàng của chúng tôi được thành công như ngày hôm nay đều là nhờ vào sự tin tưởng và ủng hộ của Quý khách.
                                        </div>
                                        <div>{moreContent}.</div>
                                        <br />
                                        <div className='main-image'>
                                            <img
                                                src="https://res.cloudinary.com/vlinh/image/upload/v1666423702/images-tieuluan/giftvoucher-600x533_bszoin.jpg" />
                                        </div>
                                        <br />
                                        <br />
                                        Danh sách voucher bao gồm:
                                        <ol>
                                            {voucherList?.map(v => <li>{v}</li>)}
                                        </ol>
                                        <p><i>Lưu ý</i>: Chương trình chỉ áp dụng đối với khách hàng nhận được mail này của chúng tôi.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <br />
                <ButtonCustom isLoading={isLoading} type='submit' >Gửi tặng</ButtonCustom>
            </Form>
        </div>
    );
}

export default VoucherGive;