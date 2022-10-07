import React from 'react';
import PropTypes from 'prop-types';
import './FilterItem.scss';
import { Button, Checkbox, Slider, Space } from 'antd';
import { numberWithCommas } from 'assets/admin';
import { useDispatch, useSelector } from 'react-redux';
import { onFilter } from 'pages/User/userSlice';

FilterItem.propTypes = {
    isSlider: PropTypes.bool,
    title: PropTypes.string,
    name: PropTypes.string,
    listItem: PropTypes.array,
    rangeValue: PropTypes.array,
};

FilterItem.defaultProps = {
    isSlider: false,
    title: '',
    name: '',
    listItem: [],
    rangeValue: [],
};

function FilterItem(props) {
    const { isSlider, title, listItem, name, rangeValue } = props;
    const [currentPrice, setCurrentPrice] = React.useState([50, 100]);
    const { groupFilter } = useSelector(state => state.userInfo);
    const dispatch = useDispatch();

    const handleFilter = (values) => {
        dispatch(onFilter({ name, filterValue: values }))
    }

    React.useEffect(() => {
        rangeValue.length > 1 && setCurrentPrice(rangeValue);
    }, [rangeValue])

    return (
        <div className='filter-item'>
            <h2 className='filter-item__name'>{title}</h2>

            {
                isSlider
                    ?
                    <div className="slider-wrapper">
                        <Slider tooltipVisible={false} range min={rangeValue.length > 0 && rangeValue[0]} max={rangeValue.length > 0 && rangeValue[1]} value={currentPrice}
                            onChange={(values) => setCurrentPrice(values)} />
                        <div className="controls">
                            <div className='show-price-wrapper'>
                                Giá: <span className='show-price'><span className='fromto'>{numberWithCommas(currentPrice?.length > 0 && currentPrice[0])}</span>&nbsp;₫&nbsp;-&nbsp;<span className='fromto'>{numberWithCommas(currentPrice?.length > 0 && currentPrice[1])}</span>&nbsp;₫</span>
                            </div>
                            <button onClick={() => handleFilter(currentPrice)}>Lọc</button>
                        </div>
                    </div>
                    :
                    <Checkbox.Group
                        className='filter-item__list-item'
                        value={groupFilter[name]}
                        onChange={handleFilter}>
                        <Space style={{ width: "100%" }} direction="vertical">
                            {
                                listItem.map((item, idx) => item.label ? <Checkbox key={idx} value={item.id} className='item'>
                                    <span>{item.label}</span>
                                    <span className='quantity'>({item.quantity})</span>
                                </Checkbox> : <></>)
                            }

                        </Space>
                    </Checkbox.Group>


            }


        </div>
    );
}

export default FilterItem;