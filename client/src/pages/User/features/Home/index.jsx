import Aos from 'aos';
import { sanphamApi } from 'api/sanphamApi';
import EventUI from 'pages/User/components/EventUI';
import React from 'react';
import { useSelector } from 'react-redux';
import Banner from './Components/Banner';
import ListProducts from './Components/ListProducts';
import './Home.scss';


Home.propTypes = {

};
const animations = ['fade-up', 'slide-up', 'zoom-in-up'];
function Home(props) {
    const { productInCartListID, data: { favouriteListID, productTypeList } } = useSelector(state => state.userInfo);

    React.useEffect(() => {
        Aos.init({
            duration: 1000
        });
    }, [])

    const [productList, setProductList] = React.useState([]);

    React.useEffect(() => {
        productTypeList?.map(async (productType, idx) => {
            try {
                const { result } = await sanphamApi.getAll({ MA_LOAI_SP: productType.MA_LOAI_SP, filterBy: 'MA_LOAI_SP', _page: 1, _limit: 8 });
                setProductList(prev => {
                    let newList = [...prev];
                    newList[idx] = result;
                    return newList;
                });
            } catch (error) {
                console.log({ error });
            }
        })
    }, [productTypeList])


    return (
        <div className='home'>
            <Banner />
            <EventUI />
            <div className='list-products'>{
                productTypeList?.map((productType, idx) => productList?.length > 0 && productList[idx]?.length > 0 &&
                    <ListProducts
                        productList={productList.length > 0 ? productList[idx] : []}
                        key={idx}
                        favouriteList={favouriteListID}
                        productInCartList={productInCartListID}
                        categoryTitle={productType.TEN_LOAI_SP}
                        categoryID={productType.MA_LOAI_SP}
                        animation={animations[idx % animations.length]} />
                )
            }
            </div>
        </div>
    );
}

export default Home;