import React from 'react';
import PropTypes from 'prop-types';
import './GroupProductImage.scss';
import CarouselCustom from 'features/Home/Components/CarouselCustom';

GroupProductImage.propTypes = {

};

function GroupProductImage(props) {
    return (
        <div className='group-product-image'>
            <CarouselCustom dots={true}>
                <div className='product-image'>
                    <img src='http://mauweb.monamedia.net/dongho/wp-content/uploads/2018/03/dong-ho-casio-ga-110gb-1adr-nam-pin-day-nhua-600x600.jpg'></img>
                </div>
                <div className='product-image'>
                    <img src='https://mauweb.monamedia.net/dongho/wp-content/uploads/2018/03/13900AA05.BDC102-600x600-300x300.jpg'></img>
                </div>
                <div className='product-image'>
                    <img src='https://mauweb.monamedia.net/dongho/wp-content/uploads/2018/03/dong-ho-tissot-t063.907.11.058.00-nam-tu-dong-day-inox-600x600-300x300.jpg'></img>
                </div>
            </CarouselCustom>
        </div>
    );
}

export default GroupProductImage;