import FeedBack from '../FeedBack';
import PropTypes from 'prop-types';

import './FeedBackList.scss';
import { Avatar, List, Skeleton } from 'antd';

FeedBackList.propTypes = {
    feedBackList: PropTypes.array,
    isLoading: PropTypes.bool,
};

FeedBackList.defaultProps = {
    feedBackList: [],
    isLoading: false,
};

function FeedBackList(props) {
    const { feedBackList, isLoading } = props;
    return (
        <ul className='feedback-list'>
            {/* <p>Hiện chưa có đánh giá nào</p> */}
            {
                isLoading
                    ? <>
                        {
                            new Array(4).fill(0).map((_, idx) => <>
                                <Skeleton key={idx} loading={true} active avatar />
                                <br />
                            </>
                            )
                        }
                    </>
                    : feedBackList?.map((feedBack, idx) =>
                        <FeedBack key={idx} feedBack={feedBack} />
                    )
            }
        </ul>
    );
}

export default FeedBackList;