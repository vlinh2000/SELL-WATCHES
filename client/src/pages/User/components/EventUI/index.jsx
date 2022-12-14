import { Col, Row, Tag } from 'antd';
import { sukienApi } from 'api/sukienApi';
import { uudaiApi } from 'api/uudaiApi';
import { BANNER_GIVE_VOUCHER } from 'constants/commonContants';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import CountDownTimer from '../CountDownTimer';
import Voucher from '../Voucher';
import './EventUI.scss';
EventUI.propTypes = {

};

function EventUI(props) {
    const [voucherList, setVoucherList] = React.useState([]);
    const [eventNearest, setEventNearest] = React.useState();
    const [durationTime, setDurationTime] = React.useState(null);

    const { data: { myVouchersID }, hadOrder } = useSelector(state => state.userInfo);

    const fetchVoucherList = async () => {
        try {
            const { result } = await uudaiApi.getAll();
            setVoucherList(result);
        } catch (error) {
            console.log({ error })
        }
    }


    React.useEffect(() => {
        const fetchEventNearest = async () => {
            try {
                const { result } = await sukienApi.getAll({ _limit: 1, _page: 1, action: 'nearest' });
                setEventNearest(result[0]);
            } catch (error) {
                console.log({ error })
            }
        }

        fetchEventNearest();
    }, []);

    React.useEffect(() => {
        if (!eventNearest) return;
        let second = 0;
        if (moment().isBefore(moment(eventNearest.TG_KET_THUC))) {
            const dateStart = moment(eventNearest.TG_BAT_DAU).format('YYYY-MM-DD').toString() + ' ' + eventNearest.KHUNG_GIO_TU;
            // truoc su kien
            if (moment().isBefore(moment(dateStart))) {
                var duration = moment.duration(moment(dateStart).diff(moment()));
                console.log({ start: moment(dateStart), now: moment(), start1: moment(eventNearest.TG_BAT_DAU) })
                second = Math.trunc(duration._milliseconds / 1000);

            }
            // trong su kien
            else {
                console.log("checked")
                const today = moment().format('YYYY-MM-DD').toString();
                var duration_hours = null;

                if (moment().isBefore(moment(today + ' ' + eventNearest.KHUNG_GIO_TU))) {
                    duration_hours = moment.duration(moment(today + ' ' + eventNearest.KHUNG_GIO_TU).diff(moment()));
                }
                else if (moment().isAfter(moment(today + ' ' + eventNearest.KHUNG_GIO_DEN))) {
                    const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD').toString();
                    if (moment(tomorrow + ' ' + eventNearest.KHUNG_GIO_TU).isBefore(moment(eventNearest.TG_KET_THUC))) {
                        duration_hours = moment.duration(moment(tomorrow + ' ' + eventNearest.KHUNG_GIO_TU).diff(moment()));
                    } else return;
                } else {
                    fetchVoucherList();
                    console.log("fetching")
                    return;
                }
                second = Math.trunc(duration_hours._milliseconds / 1000);
            }
        }

        const time = new Date();
        time.setSeconds(time.getSeconds() + second);
        setDurationTime(second === 0 ? null : time);
    }, [eventNearest])

    React.useEffect(() => {
        console.log({ durationTime: durationTime })
    }, [durationTime])

    return (<>
        {
            eventNearest &&
            <div className='event-ui'>
                <Row>
                    <Col xs={24} sm={16} md={16} lg={16}>
                        <div className='main-info'>
                            <img alt='voucher-img' src={BANNER_GIVE_VOUCHER} />
                            <div className='more-info'>
                                <div>T??n s??? ki???n: <strong>{eventNearest?.TEN_SK}</strong></div>
                                <div>Th???i gian: <strong>{moment(eventNearest?.TG_BAT_DAU).format('DD-MM-YYYY')}</strong> ?????n <strong>{moment(eventNearest?.TG_KET_THUC).format('DD-MM-YYYY')}</strong></div>
                                <div>Khung gi???: {moment('2022-1-1 ' + eventNearest?.KHUNG_GIO_TU).format('HH:mm:ss')} ?????n {moment('2022-1-1 ' + eventNearest?.KHUNG_GIO_DEN).format('HH:mm:ss')}</div>
                                <i>L??u ??: Ch??? ??p d???ng ?????i v???i KH ???? mua h??ng b??n web</i>
                            </div>

                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8}>
                        <div className='count-down'>
                            {
                                durationTime ?
                                    <CountDownTimer expiryTimestamp={durationTime} onExpire={fetchVoucherList} /> : <Tag color='#55acee'>S??? ki???n ??ang di???n ra</Tag>
                            }
                        </div>
                    </Col>
                </Row>
                {/* <Divider /> */}
                {
                    voucherList?.length > 0 &&
                    <div className="voucher-list">
                        <h2 className='voucher-list__title'>Danh s??ch m?? gi???m gi?? trong s??? ki???n</h2>
                        <Row gutter={[10, 10]} >
                            {
                                voucherList?.map((voucher, idx) =>
                                    <Col key={idx} xs={24} sm={24} md={12} lg={8}>
                                        <Voucher saveAvailable={hadOrder} isSaved={myVouchersID?.includes(voucher.MA_UU_DAI)} name={voucher.TEN_UU_DAI} id={voucher.MA_UU_DAI} expire={new Date(voucher.HSD).toString()} mode='save' />
                                    </Col>
                                )
                            }
                        </Row>
                    </div>
                }
            </div>
        }
    </>
    );
}

export default EventUI;