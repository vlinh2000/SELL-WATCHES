import React from 'react';
import PropTypes from 'prop-types';
import './FilterItem.scss';
import { Button, Slider } from 'antd';

FilterItem.propTypes = {
    isSlider: PropTypes.bool,
    title: PropTypes.string,
    name: PropTypes.string,
    listItem: PropTypes.array
};

FilterItem.defaultProps = {
    isSlider: false,
    title: '',
    name: '',
    listItem: []
};

function FilterItem(props) {
    const { isSlider, title, listItem, name } = props;

    const handleFilter = (item) => {
        console.log({ item })
    }

    return (
        <div className='filter-item'>
            <h2 className='filter-item__name'>{title}</h2>

            {
                isSlider
                    ?
                    <div className="slider-wrapper">
                        <Slider range defaultValue={[20, 50]} />
                        <div className="controls">
                            <div className='show-price-wrapper'>
                                Giá: <span className='show-price'><span className='fromto'>1,677,000</span>&nbsp;₫&nbsp;-&nbsp;<span className='fromto'>13,434,182</span>&nbsp;₫</span>
                            </div>
                            <button>Lọc</button>
                        </div>
                    </div>
                    : <ul className='filter-item__list-item'>
                        {
                            listItem.map((item, idx) => <li key={idx} className='item'>
                                <a onClick={(e) => {
                                    e.preventDefault();
                                    handleFilter({ name, id: item.id || item.label })
                                }} href=''>{item.label}</a>
                                <span className='quantity'>({item.quantity})</span>
                            </li>)
                        }
                    </ul>


            }


        </div>
    );
}

export default FilterItem;