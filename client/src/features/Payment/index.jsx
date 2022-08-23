import React from 'react';
import PropTypes from 'prop-types';
import { CodeOutlined, EditOutlined, PlusOutlined, QuestionOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Drawer, Form, Input, Modal, Radio, Row, Space, Table, Tooltip } from 'antd';
import InputField from 'custom-fields/InputField';
import SelectField from 'custom-fields/SelectField';
import ButtonCustom from 'components/ButtonCustom';
import './Payments.scss';

Payments.propTypes = {

};

function NotFoundAddress() {
    return <Tooltip title="Chọn địa chỉ để xem phí vận chuyển">
        <QuestionOutlined style={{ cursor: 'pointer' }} />
    </Tooltip>
}


function Payments(props) {

    const [showUseVoucherForm, setShowUseVoucherForm] = React.useState(false);

    return (
        <div className='wrapper-content'>
            <div className="payments">
                <div className='note'>
                    Bạn đã có tài khoản? <a>Ấn vào đây để đăng nhập</a>

                </div>
                <div className='note'>
                    <CodeOutlined />  Có mã ưu đãi? <a onClick={(e) => {
                        e.preventDefault();
                        setShowUseVoucherForm(prev => !prev);
                    }}>Ấn vào đây để nhập mã</a>
                    <Collapse activeKey={[showUseVoucherForm ? '1' : '0']} >
                        <Collapse.Panel showArrow={false} key="1">
                            <p>Nếu bạn có mã giảm giá, vui lòng điền vào phía bên dưới.</p>
                            <Row>
                                <Col lg={20}>
                                    <InputField />
                                </Col>
                                <Col lg={4}>
                                    <ButtonCustom style={{ width: '100%', justifyContent: 'center', textTransform: 'uppercase' }} text="Áp dụng" />
                                </Col>
                            </Row>
                        </Collapse.Panel>
                    </Collapse>
                </div>
                <div className="main-content">
                    <Row gutter={[30, 0]}>
                        <Col xs={24} sm={24} md={10} lg={13}>
                            <div className="left-side">
                                <h1>Thông tin thanh toán</h1>
                                <Form layout='vertical'>
                                    <InputField name='name' label='Họ tên' required />
                                    <InputField name='phone' label='Số điện thoại' required />
                                    <InputField name='email' label='Địa chỉ email' required />
                                    {/* <SelectField name='city' label='Tỉnh / Thành phố' options={[{ label: "a", value: "a" }]} required />
                                    <SelectField name='district' label='Quận / Huyện' options={[{ label: "a", value: "a" }]} required />
                                    <SelectField name='ward' label='Phường / Xã' options={[{ label: "a", value: "a" }]} required /> */}
                                    <InputField
                                        name='note'
                                        label='Ghi chú đơn hàng'
                                        type='textarea'
                                        placeHolder='Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn.'
                                    />
                                </Form>
                            </div>
                        </Col>

                        <Col xs={24} sm={24} md={14} lg={11}>
                            <div className="right-side">
                                <h1>Đơn hàng của bạn</h1>
                                <div className='title-custom'>
                                    <span>Sản phẩm</span>
                                    <span>Tổng cộng</span>
                                </div>
                                <div>
                                    <div className='category-label'>
                                        <span className='category-label-key'>
                                            <span className='name'>ĐỒNG HỒ TISSOT T063.907.11.058.00 NAM TỰ ĐỘNG DÂY INOX</span>&nbsp;
                                            <strong >x 1</strong>
                                        </span>
                                        <strong className='category-label-value'>28,852,000 ₫</strong>
                                    </div>
                                    <div className='category-label'>
                                        <span className='category-label-key'>
                                            <span className='name'>ĐỒNG HỒ TISSOT T063.907.11.058.00 NAM TỰ ĐỘNG DÂY INOX</span>&nbsp;
                                            <strong >x 1</strong>
                                        </span>
                                        <strong className='category-label-value'>28,852,000 ₫</strong>
                                    </div>
                                    <div className='category-label'>
                                        <span className='category-label-key'>Đơn vị vận chuyển </span><span className='category-label-value'>Giao hàng nhanh (GHN)</span>
                                    </div>
                                    <div className='category-label'>
                                        <span className='category-label-key'>Phí vận chuyển </span><span className='category-label-value'><NotFoundAddress /></span>
                                    </div>
                                    <div className='category-label'>
                                        <span className='category-label-key'>Mã ưu đãi </span><span className='category-label-value'>không áp dụng</span>
                                    </div>
                                    <div className='category-label'>
                                        <span className='category-label-key'>Tổng cộng </span><strong className='category-label-value'>28,852,000 ₫</strong>
                                    </div>
                                    <br />
                                    <div>
                                        <div style={{
                                            fontSize: 14,
                                            fontWeight: 500,
                                            marginBottom: 10
                                        }}>Phương thức thanh toán</div>
                                        <Radio.Group defaultValue={1}>
                                            <Space direction="vertical" >
                                                <Radio checked value={1}>Thanh toán khi nhận hàng</Radio>
                                                <Radio value={2}>Thanh toán momo</Radio>
                                            </Space>
                                        </Radio.Group>
                                    </div>
                                    <br />
                                    <Form layout='vertical' className='form-address'>
                                        <InputField
                                            name='address'
                                            type='textarea'
                                            rows={3}
                                            label='Địa chỉ giao hàng' disabled />
                                        <a>Chọn</a>
                                        <Modal

                                            title="Chọn địa chỉ giao hàng"
                                            visible={false} onOk={() => console.log("OK")}
                                            onCancel={() => console.log("cancel")}
                                            okText="Save">
                                            <Radio.Group defaultValue={1}>
                                                <Space style={{ width: '100%' }} direction="vertical">
                                                    <Radio value={1}>
                                                        <div className='radio-item'>
                                                            <InputField disabled type='textarea' rows={2} />
                                                            <EditOutlined />
                                                        </div>
                                                    </Radio>
                                                    <Radio value={2}>
                                                        <div className='radio-item'>
                                                            <InputField disabled type='textarea' rows={2} />
                                                            <EditOutlined />
                                                        </div>
                                                    </Radio>

                                                    <br />
                                                    <br />
                                                    <br />
                                                    <Button danger icon={<PlusOutlined />} shape="circle"></Button>
                                                </Space>
                                            </Radio.Group>
                                        </Modal>
                                    </Form>
                                    <ButtonCustom style={{ width: '100%', justifyContent: 'center', textTransform: 'uppercase' }} text="Đặt hàng" />
                                </div>
                            </div>

                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
}

export default Payments;