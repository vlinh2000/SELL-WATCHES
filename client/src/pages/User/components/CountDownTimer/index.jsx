import React from 'react';
import PropTypes from 'prop-types';
import { useTimer } from 'react-timer-hook';
import './CountDownTimer.scss';

export default function CountDownTimer({ expiryTimestamp, onExpire, onRestart }) {

    const {
        seconds,
        minutes,
        hours,
        days
    } = useTimer({ expiryTimestamp, onExpire });

    return (
        <div className='timer'>
            <div className='timer__main-box'>
                <div className='timer__main-box__box'>
                    <div className='text'>ngày</div>
                    <span className='num'>{days}</span>
                </div>
                <span className='split'>:</span>
                <div className='timer__main-box__box'>
                    <div className='text'>giờ</div>
                    <span className='num'>{hours}</span>
                </div>
                <span className='split'>:</span>
                <div className='timer__main-box__box'>
                    <div className='text'>phút</div>
                    <span className='num'>{minutes}</span>
                </div>
                <span className='split'>:</span>
                <div className='timer__main-box__box'>
                    <div className='text'>giây</div>
                    <span className='num'>{seconds}</span>
                </div>
            </div>
        </div>
    );
}
