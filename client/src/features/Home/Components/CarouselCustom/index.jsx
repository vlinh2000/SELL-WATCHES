import React from 'react';
import PropTypes from 'prop-types';
import { Button, Carousel } from 'antd';
import { CaretLeftOutlined, CaretRightOutlined, LeftCircleOutlined, LeftOutlined, RightCircleOutlined, RightOutlined } from '@ant-design/icons';
import './CarouselCustom.scss';

CarouselCustom.propTypes = {
    dots: PropTypes.bool
};

CarouselCustom.defaultProps = {
    dots: false
};


function CarouselCustom(props) {
    const { dots } = props;
    const slider = React.useRef();

    const onChange = (currentSlide) => {
        console.log(currentSlide);
    };
    return (
        <div className='carousel-custom'>
            <Carousel
                afterChange={onChange}
                dots={dots}
                ref={ref => {
                    slider.current = ref;
                }}
            >
                {props.children}
            </Carousel>
            <div className='controls'>
                <LeftOutlined onClick={() => slider.current.prev()} className='prev-icon' />
                <RightOutlined onClick={() => slider.current.next()} className='next-icon' />
            </div>
        </div>
    );
}

export default CarouselCustom;