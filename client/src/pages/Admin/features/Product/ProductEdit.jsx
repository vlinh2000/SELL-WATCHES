
import { UploadOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row } from 'antd';
import { loaisanphamApi } from 'api/loaisanphamApi';
import { sanphamApi } from 'api/sanphamApi';
import { thuonghieuApi } from 'api/thuonghieuApi';
import ButtonCustom from 'components/ButtonCustom';
import InputField from 'custom-fields/InputField';
import SelectField from 'custom-fields/SelectField';
import UploadField from 'custom-fields/UploadField';
import { fetch_products } from 'pages/Admin/adminSlice';
import React from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

ProductEdit.propTypes = {

};

let schema = yup.object().shape({
    MA_LOAI_SP: yup.string().required('Loại sản phẩm không được để trống.'),
    MA_THUONG_HIEU: yup.string().required('Thương hiệu không được để trống.'),
    TEN_SP: yup.string().required('Tên sản phẩm không được để trống.'),
    GIA_GOC: yup.number().positive().integer().required('Giá gốc không được để trống.').typeError('Vui lòng nhập giá hợp lệ.'),
    GIA_BAN: yup.number().positive().integer().required('Giá bán không được để trống.').typeError('Vui lòng nhập giá hợp lệ.'),
    SO_LUONG: yup.number().integer().test('', 'Số lượng không thể âm', (value) => value >= 0).required('Số lượng không được để trống.').typeError('Vui lòng nhập số.'),
    MO_TA: yup.string().required('Mô tả không được để trống.'),
    CHAT_LIEU_DAY: yup.string().required('Chất liệu dây không được để trống.'),
    CHAT_LIEU_MAT_KINH: yup.string().required('Chất liệu mặt kính không được để trống.'),
    PIN: yup.string().required('Pin không được để trống.'),
    MUC_CHONG_NUOC: yup.string().required('Mức chống nước không được để trống.'),
    HINH_DANG_MAT_SO: yup.string().required('Hình dạng mặt số không được để trống.'),
    MAU_MAT_SO: yup.string().required('Màu mặt số không được để trống.'),
    KICH_THUOC_MAT_SO: yup.string().required('Kích thước mặt số không được để trống.'),
});

const yupSync = {
    async validator({ field }, value) {
        await schema.validateSyncAt(field, { [field]: value });
    },
};

function ProductEdit(props) {
    const { mode, currentSelected } = useSelector(({ adminInfo }) => adminInfo.screenUpdateOn.products);
    const { products: pagination } = useSelector(({ adminInfo }) => adminInfo.pagination);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isAccessory, setIsAccessory] = React.useState(false);
    const [removeList, setRemoveList] = React.useState([]);
    const [options_category, setOptions_category] = React.useState([]);
    const [options_brand, setOptions_brand] = React.useState([]);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const initialValues = {
        MA_LOAI_SP: currentSelected?.MA_LOAI_SP || undefined,
        MA_THUONG_HIEU: currentSelected?.MA_THUONG_HIEU || undefined,
        TEN_SP: currentSelected?.TEN_SP || '',
        GIA_GOC: currentSelected?.GIA_GOC || '',
        GIA_BAN: currentSelected?.GIA_BAN || '',
        GIA_BAN_CU: currentSelected?.GIA_BAN || 0,
        SO_LUONG: currentSelected?.SO_LUONG || 0,
        MO_TA: currentSelected?.MO_TA || '',
        CHAT_LIEU_DAY: currentSelected?.CHAT_LIEU_DAY || '',
        CHAT_LIEU_MAT_KINH: currentSelected?.CHAT_LIEU_MAT_KINH || '',
        PIN: currentSelected?.PIN || '',
        MUC_CHONG_NUOC: currentSelected?.MUC_CHONG_NUOC || '',
        HINH_DANG_MAT_SO: currentSelected?.HINH_DANG_MAT_SO || '',
        MAU_MAT_SO: currentSelected?.MAU_MAT_SO || '',
        KICH_THUOC_MAT_SO: currentSelected?.KICH_THUOC_MAT_SO || '',
        ANH_SAN_PHAM: currentSelected?.ANH_SAN_PHAM || [],
    }
    console.log({ initialValues })

    const handleSave = async (values) => {

        try {
            setIsLoading(true);
            let ANH_SAN_PHAM_NEW = [];
            values.ANH_SAN_PHAM?.forEach(f => {
                f.originFileObj && ANH_SAN_PHAM_NEW.push(f.originFileObj);
            });
            const ANH_SAN_PHAM_REMOVE = removeList;
            console.log({ ANH_SAN_PHAM_NEW, ANH_SAN_PHAM_REMOVE })
            const data = new FormData();
            data.append('MA_LOAI_SP', values.MA_LOAI_SP);
            data.append('MA_THUONG_HIEU', values.MA_THUONG_HIEU);
            data.append('TEN_SP', values.TEN_SP);
            data.append('GIA_GOC', values.GIA_GOC);
            data.append('GIA_BAN', values.GIA_BAN);
            data.append('GIA_BAN_CU', initialValues.GIA_BAN_CU);
            data.append('SO_LUONG', values.SO_LUONG);
            data.append('MO_TA', values.MO_TA);
            data.append('CHAT_LIEU_DAY', values.CHAT_LIEU_DAY);
            data.append('CHAT_LIEU_MAT_KINH', values.CHAT_LIEU_MAT_KINH || '');
            data.append('PIN', values.PIN || '');
            data.append('MUC_CHONG_NUOC', values.MUC_CHONG_NUOC || '');
            data.append('HINH_DANG_MAT_SO', values.HINH_DANG_MAT_SO || '');
            data.append('MAU_MAT_SO', values.MAU_MAT_SO || '');
            data.append('KICH_THUOC_MAT_SO', values.KICH_THUOC_MAT_SO || '');

            ANH_SAN_PHAM_NEW?.forEach(f => {
                data.append('ANH_SAN_PHAM', f);
            })

            data.append('ANH_SAN_PHAM_REMOVE', JSON.stringify(removeList));

            const { message } = mode === 'ADD' ? await sanphamApi.post(data) : await sanphamApi.update(currentSelected.MA_SP, data);
            await dispatch(fetch_products({ _limit: pagination._limit, _page: pagination._page }));
            // if (mode === 'ADD') {
            //     form.resetFields()
            // } else {
            // }
            navigate('/admin/products/view');
            setIsLoading(false);
            toast.success(message);
        } catch (error) {
            setIsLoading(false);
            console.log({ error });
            toast.error(error.response.data.message);
        }
    }

    React.useEffect(() => {
        const fetchAllcategory = async () => {
            try {
                const { result } = await loaisanphamApi.getAll();
                setOptions_category(result.map((e) => ({ label: e.MA_LOAI_SP + ' - ' + e.TEN_LOAI_SP, value: e.MA_LOAI_SP })))
            } catch (error) {
                console.log({ error });
            }
        }

        fetchAllcategory();
    }, [])

    React.useEffect(() => {
        const fetchAllbrand = async () => {
            try {
                const { result } = await thuonghieuApi.getAll();
                setOptions_brand(result.map((e) => ({ label: e.MA_THUONG_HIEU + ' - ' + e.TEN_THUONG_HIEU, value: e.MA_THUONG_HIEU })))
            } catch (error) {
                console.log({ error });
            }
        }

        fetchAllbrand();
    }, [])

    React.useEffect(() => {
        setIsAccessory(currentSelected?.MA_LOAI_SP === 'LSP_phukien');
    }, [currentSelected])

    return (
        <div className='employee-edit box'>
            <Form
                onFinish={handleSave}
                form={form}
                initialValues={initialValues}
                layout='vertical'>
                <Row gutter={[40, 0]}>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <SelectField name='MA_LOAI_SP' label='Loại sản phẩm' placeHolder='-- Chọn loại sản phẩm --' options={options_category} onChange={value => setIsAccessory(value === 'LSP_phukien')} rules={[yupSync]} />
                        <SelectField name='MA_THUONG_HIEU' label='Thương hiệu' placeHolder='-- Chọn thương hiệu --' options={options_brand} rules={[yupSync]} />
                        <InputField name='TEN_SP' label='Tên sản phẩm' placeHolder='-- Nhập tên sản phẩm --' rules={[yupSync]} />
                        <InputField name='GIA_GOC' label='Giá gốc' placeHolder='-- Nhập giá gốc --' rules={[yupSync]} />
                        <InputField name='GIA_BAN' label='Giá bán' placeHolder='-- Nhập giá bán --' rules={[yupSync]} />
                        <InputField name='SO_LUONG' label='Số lượng' placeHolder='-- Nhập số lượng --' rules={[yupSync]} />
                        <InputField name='MO_TA' type='textarea' label='Mô tả' placeHolder='-- Nhập mô tả --' rules={[yupSync]} />

                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <InputField name='CHAT_LIEU_DAY' label='Chất liệu dây' placeHolder='-- Nhập chất liệu dây --' rules={isAccessory ? [] : [yupSync]} />
                        {
                            !isAccessory &&
                            <>
                                <InputField name='CHAT_LIEU_MAT_KINH' label='Chất liệu mặt kính' placeHolder='-- Nhập chất liệu mặt kính --' rules={[yupSync]} />
                                <InputField name='PIN' label='Pin' placeHolder='-- Nhập pin --' rules={[yupSync]} />
                                <InputField name='MUC_CHONG_NUOC' label='Mức chống nước' placeHolder='-- Nhập mức chống nước --' rules={[yupSync]} />
                                <InputField name='HINH_DANG_MAT_SO' label='Hình dạng mặt số' placeHolder='-- Nhập hình dạng mặt số --' rules={[yupSync]} />
                                <InputField name='MAU_MAT_SO' label='Màu mặt số' placeHolder='-- Nhập màu mặt số --' rules={[yupSync]} />
                                <InputField name='KICH_THUOC_MAT_SO' label='Kích thước mặt số' placeHolder='-- Nhập kích thước mặt số --' rules={[yupSync]} />
                            </>
                        }
                        <UploadField saveData={(fileList) => form.setFieldValue("ANH_SAN_PHAM", fileList)} onRemove={(file) => {
                            if (!file.originFileObj) setRemoveList(prev => [...prev, file.uid])
                        }}
                            defaultFileList={currentSelected?.ANH_SAN_PHAM?.map((e) => ({ uid: e.MA_ANH, url: e.HINH_ANH }))} rules={[{ required: true, message: "Ảnh sản phẩm không được để trống." }]} name='ANH_SAN_PHAM' label='Ảnh sản phẩm' showUploadList icon={<UploadOutlined />} listType="picture-card" />
                    </Col>
                </Row>
                {/* <SelectField name='CHAT_LIEU_MAT_KINH' label='Chất liệu mặt kính' rules={[yupSync]} options={options_ProductType} /> */}
                <br />
                <ButtonCustom type='submit' isLoading={isLoading}>Lưu</ButtonCustom>
            </Form>
        </div>
    );
}

export default ProductEdit;