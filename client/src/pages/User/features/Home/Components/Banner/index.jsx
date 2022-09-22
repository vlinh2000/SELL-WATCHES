import React from 'react';
import PropTypes from 'prop-types';
import CarouselCustom from '../CarouselCustom';
import './Banner.scss';
import ButtonCustom from 'components/ButtonCustom';
import { Link } from 'react-router-dom';

Banner.propTypes = {

};

function Banner(props) {
    return (
        <div className='banner' data-aos="fade">
            <CarouselCustom>
                <div class="slider-custom" >
                    <div className='slider-bg' style={{ backgroundImage: 'url(http://mauweb.monamedia.net/donghohaitrieu/wp-content/uploads/2019/07/slide-bg-1.jpg)' }}>
                        <div className='slider-content' >
                            <h4>Mona Watch</h4>
                            <h1>Đồng hồ classico</h1>
                            <p>Cùng với sự phát triển không ngừng của thời trang thế giới, rất nhiều thương hiệu cho ra đời những mẫu đồng hồ nam chính hãng đa dạng về phong cách, kiểu dáng, màu sắc, kích cỡ…</p>
                            <Link className='view-product' to="/category/all">Xem sản phẩm</Link>
                        </div>
                    </div>
                </div>
                <div class="slider-custom">
                    <div className='slider-bg' style={{ backgroundImage: 'url(http://mauweb.monamedia.net/donghohaitrieu/wp-content/uploads/2019/07/slide-bg-2.jpg)' }}>
                        <div className='slider-content'>
                            <h4>Mona Watch</h4>
                            <h1>Đồng hồ classico</h1>
                            <p>Cùng với sự phát triển không ngừng của thời trang thế giới, rất nhiều thương hiệu cho ra đời những mẫu đồng hồ nam chính hãng đa dạng về phong cách, kiểu dáng, màu sắc, kích cỡ…</p>
                            <Link className='view-product' to="/category/all">Xem sản phẩm</Link>
                        </div>
                    </div>
                </div>
            </CarouselCustom>
        </div>
    );
}

export default Banner;