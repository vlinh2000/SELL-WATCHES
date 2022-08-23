import React from 'react';
import PropTypes from 'prop-types';
import Banner from './Components/Banner';
import Title from 'components/Title';
import ListProducts from './Components/ListProducts';
import Aos from 'aos';


Home.propTypes = {

};

function Home(props) {
    React.useEffect(() => {
        Aos.init({
            duration: 2000
        });
    }, [])


    return (
        <div className='home'>
            <Banner />
            <div className='list-products'>
                <ListProducts animation="fade-up" category="Đồng hồ nam" />
                <ListProducts animation="slide-up" category="Đồng hồ nữ" />
                <ListProducts animation="zoom-in-up" category="Đồng hồ đôi" />
            </div>
        </div>
    );
}

export default Home;