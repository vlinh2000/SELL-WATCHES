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

VoucherGive.propTypes = {

};
let schema = yup.object().shape({
    OPT_DS_USER: yup.string().required('Chưa chọn đối tượng nhận ưu đãi.'),
    NOI_DUNG: yup.string().required('Nội dung không được để trống.'),
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
    const [isLoading, setIsLoading] = React.useState(false);
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
                setOptions_vouchers(result?.map(v => ({ label: v.TEN_UU_DAI, value: JSON.stringify(v) })));
            } catch (error) {
                console.log({ error })
            }
        }

        fetchAllVoucher()
    }, [])

    return (
        <div className='voucher-give box'>
            <Form
                form={form}
                initialValues={initialValues}
                layout='vertical'
                onFinish={(values) => handleGiveVoucher(values)}>
                <Row gutter={[20, 0]} justify="space-between">
                    <Col xs={24} sm={11} >
                        <Form.Item label="Chọn người nhận:" name="OPT_DS_USER" rules={[yupSync]}>
                            <Radio.Group onChange={({ target }) => setIsChooseGroupUser(target.value === 'group')}>
                                <Space direction="vertical">
                                    <Radio value='allUser'>Tất cả</Radio>
                                    <Radio value='group'>Nhóm người</Radio>
                                </Space>
                            </Radio.Group>
                        </Form.Item>
                        {
                            isChooseGroupUser &&
                            <Form.Item
                                rules={[{ required: true, message: "Chưa chọn user" }]}
                                name="DS_USER">
                                <Select
                                    mode="multiple"
                                    allowClear
                                    placeholder="Tìm kiếm ...">
                                    {
                                        options_users?.map((user) =>
                                            <Select.Option key={user.USER_ID} value={JSON.stringify({ USER_ID: user.USER_ID, EMAIL: user.EMAIL })}><Avatar size="small" src={user.ANH_DAI_DIEN}>{user.ANH_DAI_DIEN ? '' : user.HO_TEN.charAt(0).toUpperCase()}</Avatar>&nbsp;{user.HO_TEN}</Select.Option>
                                        )
                                    }
                                </Select>
                            </Form.Item>
                        }
                        <div style={{ marginBottom: 10 }}>Nội dung:</div>
                        <InputField
                            rules={[yupSync]}
                            name='NOI_DUNG' type='textarea' placeHolder='Nhân dịp gì ?' />
                    </Col>
                    <Col xs={24} sm={11} >
                        <Form.Item
                            rules={[yupSync]}
                            label="Chọn voucher:" name="DS_VOUCHER">
                            <Checkbox.Group options={options_vouchers} />
                        </Form.Item>
                    </Col>
                </Row>
                <br />
                <ButtonCustom isLoading={isLoading} type='submit' text='Gửi tặng' />
            </Form>
        </div>
    );
}

export default VoucherGive;