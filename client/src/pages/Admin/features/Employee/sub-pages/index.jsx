import React from 'react';
import PropTypes from 'prop-types';
import InputField from 'custom-fields/InputField';
import SelectField from 'custom-fields/SelectField';
import { Button, Col, Form, Row } from 'antd';

EmployeeEdit.propTypes = {

};

function EmployeeEdit(props) {
    return (
        <div className='employee-edit box'>
            <Form
                layout='vertical'>
                <Row gutter={[20, 0]}>
                    <Col xs={24} sm={12} md={12} lg={12}>
                        <InputField name='id' disabled label='Mã nhân viên' />
                        <InputField name='name' label='Họ tên' />
                        <InputField name='phone' label='Số điện thoại' />
                        <SelectField labelInValue name='gender' label='Giới tính' options={[{ value: 'Nam' }, { value: 'Nữ' }, { value: 'Khác' }]} />
                        <InputField name='userName' label='Tài khoản' />
                        <InputField name='passWord' label='Mật khẩu' />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12}>
                        <SelectField name='position' label='Chức vụ' />
                        <SelectField mode="tags" name='rule' label='Quyền' />
                        <InputField name='address' label='Địa chỉ' type='textarea' rows={5} />
                    </Col>
                </Row>
                <br />
                <Button className='admin-custom-btn bottom-btn' type='submit'>Lưu</Button>
            </Form>
        </div>
    );
}

export default EmployeeEdit;