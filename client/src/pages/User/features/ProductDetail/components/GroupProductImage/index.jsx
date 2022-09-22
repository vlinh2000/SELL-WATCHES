import React from 'react';
import PropTypes from 'prop-types';
import './GroupProductImage.scss';
import CarouselCustom from 'pages/User/features/Home/Components/CarouselCustom';

GroupProductImage.propTypes = {
    imageList: PropTypes.array
};

GroupProductImage.defaultProps = {
    imageList: []
};

function GroupProductImage(props) {
    const { imageList } = props;
    return (
        <div className='group-product-image'>
            <CarouselCustom dots={true}>
                {
                    imageList?.map((img, idx) =>
                        <div key={idx} className='product-image'>
                            <img src={img.HINH_ANH} alt="anhsanpham" />
                        </div>
                    )
                }
            </CarouselCustom>
        </div>
    );
}

export default GroupProductImage;