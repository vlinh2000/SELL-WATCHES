
import { DeleteOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Form, Row } from 'antd';
import { nhacungcapApi } from 'api/nhacungcapApi';
import { phieunhapApi } from 'api/phieunhapApi';
import { sanphamApi } from 'api/sanphamApi';
import InputField from 'custom-fields/InputField';
import SelectField from 'custom-fields/SelectField';
import { fetch_receipts } from 'pages/Admin/adminSlice';
import React from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

ReceiptEdit.propTypes = {

};
function validateAgainstPrevious() {
    // In this case, parent is the entire array
    const { parent } = this;

    // filtered array vechicles that doens't have registrationNumber
    const filteredArray = parent.filter((e) => !e.DON_GIA);

    // If length of vehicles that doesn't have registrationNumber is equals to vehicles  array length then return false;
    if (filteredArray.length === parent.length) return false;

    return true;
}

let schema = yup.object().shape({
    MA_NCC: yup.string().required('Nhà cung cấp không được để trống.'),
    SAN_PHAM: yup.array().min(1, 'Sản phẩm không được để trống.')
});

const yupSync = {
    async validator({ field }, value) {
        await schema.validateSyncAt(field, { [field]: value });
    },
};

function ReceiptEdit(props) {
    const { mode, currentSelected } = useSelector(({ adminInfo }) => adminInfo.screenUpdateOn.receipts);
    const { receipts: pagination } = useSelector(({ adminInfo }) => adminInfo.pagination);
    const { user } = useSelector(state => state.auth)
    const [isLoading, setIsLoading] = React.useState(false);
    const [options_Supplier, setOptions_Supplier] = React.useState([]);
    const [options_Product, setOptions_Product] = React.useState([]);
    const [listProduct, setListProduct] = React.useState(() => new Array(currentSelected?.SAN_PHAM?.length || 1).fill(true));
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const initialValues = {
        NV_ID: currentSelected?.NV_ID || user.NV_ID,
        HO_TEN: currentSelected?.HO_TEN || user.HO_TEN,
        MA_NCC: currentSelected?.MA_NCC || '',
        GHI_CHU: currentSelected?.GHI_CHU || '',
        SAN_PHAM: currentSelected?.SAN_PHAM || '',
    }

    const handleSave = async (values) => {
        try {
            values.TONG_TIEN = values.SAN_PHAM.reduce((a, b) => a + b.GIA, 0);
            console.log({ values });
            setIsLoading(true);
            const { message } = mode === 'ADD' ? await phieunhapApi.post(values) : await phieunhapApi.update(currentSelected.MA_PHIEU_NHAP, values);
            await dispatch(fetch_receipts({ _limit: pagination._limit, _page: pagination._page }));
            if (mode === 'ADD') {
                form.resetFields()
            } else {
                navigate('/admin/receipts/view');
            }
            setIsLoading(false);
            toast.success(message);
        } catch (error) {
            setIsLoading(false);
            console.log({ error });
            toast.error(error);
        }
    }

    React.useEffect(() => {
        const fetchAllSupplier = async () => {
            try {
                const { result } = await nhacungcapApi.getAll();
                const options = result.map((e) => ({ label: e.TEN_NCC, value: e.MA_NCC }));
                setOptions_Supplier(options);
            } catch (error) {
                console.log({ error });
            }
        }

        fetchAllSupplier();
    }, [])

    React.useEffect(() => {
        const fetchAllProduct = async () => {
            try {
                const { result } = await sanphamApi.getAll();
                const options = result.map((e) => ({ label: e.MA_SP + ' - ' + e.TEN_SP, value: e.MA_SP }));
                setOptions_Product(options);
            } catch (error) {
                console.log({ error });
            }
        }

        fetchAllProduct();
    }, [])

    // React.useEffect(() => {
    //     form.setFieldValue('SAN_PHAM', listProduct);
    // }, [listProduct])

    const handleChangeProduct = (idx) => {
        let SAN_PHAM = form.getFieldValue('SAN_PHAM');
        if (SAN_PHAM[idx].SO_LUONG && SAN_PHAM[idx].DON_GIA) SAN_PHAM[idx].GIA = SAN_PHAM[idx].SO_LUONG * SAN_PHAM[idx].DON_GIA;
        form.setFieldValue('SAN_PHAM', SAN_PHAM);
    }

    const handleRemoveProduct = (idx) => {
        setListProduct(prev => {
            let newList = [...prev];
            newList.splice(idx, 1);
            return newList;
        });
        let SAN_PHAM = form.getFieldValue('SAN_PHAM');
        SAN_PHAM.splice(idx, 1);
        form.setFieldValue('SAN_PHAM', SAN_PHAM);
    }

    const handleChangeOptions = () => {
        let SAN_PHAM = form.getFieldValue('SAN_PHAM');
        console.log({ SAN_PHAM })
        const currentOptions = SAN_PHAM.map(sp => sp.MA_SP);
        const new_options = options_Product.map(p => currentOptions.includes(p.value) ? { ...p, disabled: true } : p);
        setOptions_Product(new_options);
    }

    return (
        <div className='employee-edit box'>
            <Form
                onValuesChange={({ SAN_PHAM = [] }) => {
                    const current_SP = [...SAN_PHAM].pop();
                    if (current_SP && (current_SP.SO_LUONG || current_SP.DON_GIA)) handleChangeProduct(SAN_PHAM.length - 1)
                    else if (current_SP?.MA_SP) handleChangeOptions();
                }}
                onFinish={handleSave}
                form={form}
                initialValues={initialValues}
                layout='vertical'>
                <Row gutter={[20, 0]} justify="space-between" align='middle'>
                    <Col xs={24} sm={12} md={9} lg={9}>
                        <InputField name='NV_ID' label='Mã nhân viên' disabled />
                        <InputField name='HO_TEN' label='Tên nhân viên' disabled />
                        <SelectField name='MA_NCC' label='Nhà cung cấp' rules={[yupSync]} options={options_Supplier} />
                    </Col>
                    <Col xs={24} sm={12} md={13} lg={13}>
                        <InputField name='GHI_CHU' label='Ghi chú' type='textarea' rows={9} />
                    </Col>
                </Row>
                <Divider />
                {
                    listProduct?.map((_, idx) => <Row key={idx} gutter={[20, 0]} >
                        <Col xs={24} sm={8} md={11} lg={11}>
                            <SelectField name={['SAN_PHAM', idx, 'MA_SP']} label={idx === 0 && 'Sản phẩm'} required
                                rules={[{ required: true, message: 'Sản phẩm không được để trống.' }]}
                                options={options_Product} />
                        </Col>
                        <Col xs={24} sm={5} md={4} lg={4}>
                            <InputField type='number' name={['SAN_PHAM', idx, 'DON_GIA']} label={idx === 0 && 'Đơn giá'} required rules={[{ required: true, message: '...' }]} />
                        </Col>
                        <Col xs={24} sm={5} md={3} lg={3}>
                            <InputField type='number' name={['SAN_PHAM', idx, 'SO_LUONG']} label={idx === 0 && 'SL'} required rules={[{ required: true, message: '...' }]} />
                        </Col>
                        <Col xs={24} sm={6} md={4} lg={4}>
                            <InputField shouldUpdate readOnly name={['SAN_PHAM', idx, 'GIA']} label={idx === 0 && 'Giá'} />
                        </Col>
                        {
                            idx !== 0 && <Col xs={24} sm={6} md={2} lg={2}>
                                <Button onClick={() => {
                                    handleRemoveProduct(idx)
                                    handleChangeOptions();
                                }}
                                    icon={<DeleteOutlined style={{ fontSize: 13 }} />} shape="circle"></Button>
                            </Col>
                        }
                    </Row>
                    )
                }
                <br />
                <Button onClick={() => setListProduct(prev => [...prev, true])} icon={<PlusSquareOutlined />}>Thêm</Button>
                <br />
                <br />
                <Divider />
                <Button htmlType='submit' className='admin-custom-btn bottom-btn' loading={isLoading}>Lưu</Button>
            </Form>

        </div>
    );
}

export default ReceiptEdit;