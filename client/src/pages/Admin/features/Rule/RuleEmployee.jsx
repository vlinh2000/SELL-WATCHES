import React from 'react';

import { CheckOutlined, CloseOutlined, ConsoleSqlOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Pagination, Popconfirm, Row, Skeleton, Switch, Table } from 'antd';
import { chucvuApi } from 'api/chucvuApi';
import { numberWithCommas } from 'assets/admin';
import { fetch_rules, prepareDataEdit, savePagination } from 'pages/Admin/adminSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import SkeletonCustom from 'pages/Admin/components/SkeletonCustom';
import { danhmucApi } from 'api/uudaiApi';
import { quyenApi } from 'api/quyenApi';
import { nhanvienApi } from 'api/nhanvienApi';
import ButtonCustom from 'components/ButtonCustom';
import './RuleEmployee.scss';

RuleEmployee.propTypes = {

};


function RuleEmployee(props) {

    const [dataSource, setdataSource] = React.useState([]);
    const [rules, setRules] = React.useState([]);
    const [employees, setEmployees] = React.useState([]);
    const [allUserRules, setAllUserRules] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(false);
    const [isLoading_save, setIsLoading_save] = React.useState(false);

    const handleSwitch = (isOn, NV_ID, MA_QUYEN) => {
        setAllUserRules(prev => {

            const index = prev[NV_ID].findIndex(rule => rule === MA_QUYEN);
            let newRules = prev[NV_ID];
            if (index === -1) {
                isOn && newRules.push(MA_QUYEN)
            } else {
                !isOn && newRules.splice(index, 1);
            }

            const newPrev = { ...prev };
            newPrev[NV_ID] = newRules;
            return newPrev;
        })
    }

    React.useEffect(() => {
        Object.keys(allUserRules)?.map(NV_ID => {
            setdataSource(prev => rules?.map((rule, idx) => ({ ...prev[idx], MA_QUYEN: rule.MA_QUYEN, TEN_QUYEN: rule.TEN_QUYEN, [NV_ID]: allUserRules[NV_ID].includes(rule.MA_QUYEN) })))
        })
        dataSource.length > 0 && setIsLoading(false);
    }, [allUserRules, rules])

    const columns = React.useMemo(() => ([
        {
            title: 'Quyền / Nhân viên',
            dataIndex: 'TEN_QUYEN'
        },
        ...(employees?.map(e => ({
            title: e.HO_TEN + ` #${e.NV_ID}`,
            dataIndex: e.NV_ID,
            render: (text, row) => <Switch size="small" onChange={(value) => handleSwitch(value, e.NV_ID, row.MA_QUYEN)} checkedChildren={<CheckOutlined style={{ fontSize: 10 }} />} unCheckedChildren={<CloseOutlined style={{ fontSize: 10 }} />} checked={text} />
        })) || [])

    ]), [employees, dataSource])

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const { result } = await quyenApi.getAll();
                setRules(result);
            } catch (error) {
                setIsLoading(false);
                console.log({ error })
            }
        }
        fetchData()
    }, [])

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const { result } = await nhanvienApi.getAll();
                setEmployees(result);
            } catch (error) {
                console.log({ error })
            }
        }
        fetchData()
    }, [])

    React.useEffect(() => {
        const fetchData = async (NV_ID) => {
            try {
                const { result } = await quyenApi.getAll({ action: 'get_user_rules', NV_ID });
                // setEmployees(result);
                const userRules = result?.map(r => r.MA_QUYEN);
                setAllUserRules(prev => ({ ...prev, [NV_ID]: userRules }))
            } catch (error) {
                console.log({ error })
            }
        }

        rules.length > 0 && employees?.map((e) => {
            fetchData(e.NV_ID)
        })
    }, [employees, rules])

    const handleSave = async () => {
        // console.log({ allUserRules })
        try {
            setIsLoading_save(true);
            const data = { action: 'employee_rules', NHAN_VIENS: JSON.stringify(allUserRules) }
            const { message } = await quyenApi.post(data);
            setIsLoading_save(false);
            toast.success(message);
        } catch (error) {
            setIsLoading_save(false);
            console.log({ error });
            toast.error(error.response.data.message);
        }
    }


    return (
        <div className='rule-employee box'>
            {
                isLoading ?
                    <SkeletonCustom />
                    :
                    <Table
                        size='small'
                        columns={columns}
                        dataSource={dataSource}
                        pagination={false}
                    />

            }
            <br />
            <ButtonCustom onClick={handleSave} isLoading={isLoading_save}>Lưu thay đổi</ButtonCustom>
        </div>
    );
}

export default RuleEmployee;

