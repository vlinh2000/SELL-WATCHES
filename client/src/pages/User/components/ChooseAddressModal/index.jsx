import React from 'react';
import PropTypes from 'prop-types';
import { switch_chooseAddressModal } from 'pages/User/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import SelectField from 'custom-fields/SelectField';
import { Button, Divider, Form, Modal, Popconfirm, Table } from 'antd';
import { DeleteOutlined, EditOutlined, PlusSquareOutlined } from '@ant-design/icons';
import axios from 'axios';
import toast from 'react-hot-toast';
import { diachighApi } from 'api/diachighApi';
import './ChooseAddressModal.scss';

ChooseAddressModal.propTypes = {
    addressList: PropTypes.array,
    onReload: PropTypes.func,
};

ChooseAddressModal.defaultProps = {
    addressList: [],
    onReload: null,
};

function ChooseAddressModal(props) {
    const { addressList: defaultList, onReload } = props;
    const [options_Provinces, setOptions_Provinces] = React.useState([]);
    const [options_district, setOptions_district] = React.useState([]);
    const [options_wards, setOptions_wards] = React.useState([]);
    const [addressCode, setAddressCode] = React.useState({ provincesCode: null, districtCode: null })
    const dispatch = useDispatch();
    const { isVisibleChooseAddressModal } = useSelector(state => state.userInfo)
    const [isLoading, setIsLoading] = React.useState(false);
    const [addressList, setAddressList] = React.useState([]);


    const handleReload = () => {
        if (!onReload) return;
        onReload();
    }

    const columns = [
        {
            title: '#',
            dataIndex: 'key'
        },
        {
            title: 'Phường/Xã',
            dataIndex: 'WARDS',
            render: (text, row) => <SelectField
                rules={[{ required: true, message: '...' }]}
                name={['DIA_CHI_GH', row.INDEX, 'WARDS']} options={options_wards} />
        },
        {
            title: 'Quận/Huyện',
            dataIndex: 'DISTRICT',
            render: (text, row) => <SelectField
                rules={[{ required: true, message: '...' }]}
                onChange={(_, options) => {
                    setAddressCode(prev => ({ ...prev, districtCode: options.code, wardsCode: null }))
                    // form.setFieldValue(`DIA_CHI_GH[${row.INDEX}].DISTRICT_ID`, options.code);
                }}

                name={['DIA_CHI_GH', row.INDEX, 'DISTRICT']} options={options_district} />
        },
        {
            title: 'Tỉnh/Thành Phố',
            dataIndex: 'PROVINCES',
            render: (text, row) => <SelectField
                rules={[{ required: true, message: '...' }]}
                onChange={(_, options) => {
                    setAddressCode(prev => ({ ...prev, provincesCode: options.code, districtCode: null }))
                }}
                name={['DIA_CHI_GH', row.INDEX, 'PROVINCES']} options={options_Provinces} />
        },
        {
            title: 'Hành động',
            dataIndex: 'MA_DANH_MUC',
            render: (text, record) => <>
                {/* <Button
                    onClick={() => { setIsEdit({ numRow: record.INDEX, is: true }) }}
                    icon={<EditOutlined />}></Button> */}
                <Popconfirm
                    title={`Bạn có chắc muốn xóa địa chỉ này ?`}
                    onConfirm={() => { handleDeleteAddress(record.MA_DC, record.INDEX) }}
                    okText="Yes"
                    cancelText="No">
                    <Button style={{ marginLeft: 5 }} danger icon={<DeleteOutlined />}></Button>
                </Popconfirm>
            </>
        },
    ];

    const address = React.useMemo(() => {
        return defaultList?.map((ad, idx) => {
            const [WARDS, DISTRICT, PROVINCES] = ad.DIA_CHI?.split(', ') || ['', '', ''];
            return { INDEX: idx, WARDS, DISTRICT, PROVINCES, key: idx + 1, MA_DC: ad.MA_DC, DISTRICT_ID: null }
        })
    }, [defaultList])


    const initialValues = {
        DIA_CHI_GH: address
    }

    React.useEffect(() => {
        setAddressList(address);
        form.setFieldsValue({ DIA_CHI_GH: address })
    }, [address])

    React.useEffect(() => {
        const fetchAllProvinces = async () => {
            try {
                const { data: { data } } = await axios.get(process.env.REACT_APP_GHN_PROVINCE, { headers: { token: process.env.REACT_APP_GHN_TOKEN } });
                console.log({ data });
                setOptions_Provinces(data.map((e) => ({ label: e.NameExtension[1], value: e.NameExtension[1] + ' (' + e.ProvinceID + ')', code: e.ProvinceID })))
            } catch (error) {
                console.log({ error });
            }
        }

        fetchAllProvinces();
    }, [])

    React.useEffect(() => {
        const fetchAllDistrictInProvinces = async () => {
            try {
                if (addressCode.provincesCode == null) {
                    setOptions_district([]);
                    return;
                }
                const { data: { data } } = await axios.get(process.env.REACT_APP_GHN_DISTRICT, { params: { 'province_id': addressCode.provincesCode }, headers: { token: process.env.REACT_APP_GHN_TOKEN } });
                console.log({ data })
                setOptions_district(data.map((e) => ({ label: e.DistrictName, value: e.DistrictName + ' (' + e.DistrictID + ')', code: e.DistrictID })))
            } catch (error) {
                console.log({ error });
            }
        }

        fetchAllDistrictInProvinces();

    }, [addressCode.provincesCode])

    React.useEffect(() => {
        const fetchAllWardsInDistrict = async () => {
            try {
                if (addressCode.districtCode == null) {
                    setOptions_wards([]);
                    return;
                }
                const { data: { data } } = await axios.get(process.env.REACT_APP_GHN_WARD, { params: { 'district_id': addressCode.districtCode }, headers: { token: process.env.REACT_APP_GHN_TOKEN } });
                setOptions_wards(data.map((e) => ({ label: e.WardName, value: e.WardName + ' (' + e.WardCode + ')', code: e.WardCode })))
            } catch (error) {
                console.log({ error });
            }
        }

        fetchAllWardsInDistrict();

    }, [addressCode.districtCode])

    const handleSaveAddress = async (values) => {
        try {
            setIsLoading(true);
            const data = values.DIA_CHI_GH?.map((ad, idx) => ({ MA_DC: addressList[idx].MA_DC, DIA_CHI: `${ad.WARDS}, ${ad.DISTRICT}, ${ad.PROVINCES}` }));
            const { message } = await diachighApi.post({ DIA_CHI: JSON.stringify(data) });
            toast.success(message);
            setIsLoading(false);
            handleReload();
            dispatch(switch_chooseAddressModal(false))
        } catch (error) {
            setIsLoading(false);
            toast.error(error.response.data.message);
            console.log({ error })
        }

    }

    const handleDeleteAddress = async (MA_DC, numRow) => {
        try {
            if (!MA_DC) {
                setAddressList(prev => {
                    let listAfterRemove = [...prev];
                    listAfterRemove.splice(numRow, 1);
                    return listAfterRemove;
                });
                return;
            }

            setIsLoading(true);
            const { message } = await diachighApi.delete(MA_DC);
            toast.success(message);
            setIsLoading(false);
            handleReload();
            // dispatch(switch_chooseAddressModal(false))
        } catch (error) {
            setIsLoading(false);
            toast.error(error.response.data.message);
            console.log({ error })
        }

    }

    const [form] = Form.useForm();
    return (
        <div>
            {/* choose address modal */}
            <Modal
                className='choose-address-modal'
                width={900}
                title="Cập nhật địa chỉ giao hàng"
                visible={isVisibleChooseAddressModal}
                onCancel={() => dispatch(switch_chooseAddressModal(false))}
                footer={[
                    <Button loading={isLoading} disabled={addressList.length < 1} type='primary' onClick={() => form.submit()}>Lưu lại</Button>
                ]}>
                <Form
                    onFinish={handleSaveAddress}
                    form={form}
                    initialValues={initialValues}
                    layout='vertical' className='form-address'>
                    <Table
                        size='small'
                        columns={columns}
                        dataSource={addressList}
                        pagination={false}
                    />
                    <Divider />
                    <Button icon={<PlusSquareOutlined />} onClick={() => setAddressList(prev => [...prev, { INDEX: prev.length, WARDS: null, DISTRICT: null, PROVINCES: null, key: prev.length + 1 }])}>Thêm</Button>
                </Form>
            </Modal>
        </div>
    );
}

export default ChooseAddressModal;