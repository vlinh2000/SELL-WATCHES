import FeedBack from '../FeedBack';
import './FeedBackList.scss';

FeedBackList.propTypes = {

};

function FeedBackList(props) {

    return (
        <ul className='feedback-list'>
            {/* <p>Hiện chưa có đánh giá nào</p> */}
            <FeedBack />
            <FeedBack />
            <FeedBack />
            <FeedBack />
        </ul>
    );
}

export default FeedBackList;