import PropTypes from 'prop-types';
import FeedBack from '../FeedBack';

import { Skeleton } from 'antd';
import { danhgiaApi } from 'api/danhgiaApi';
import toast from 'react-hot-toast';
import './FeedBackList.scss';

FeedBackList.propTypes = {
    feedBackList: PropTypes.array,
    isLoading: PropTypes.bool,
    feedBackAvailable: PropTypes.bool,
    onReFreshFeedBackList: PropTypes.func
};

FeedBackList.defaultProps = {
    feedBackList: [],
    isLoading: false,
    feedBackAvailable: false,
    onReFreshFeedBackList: null
};

function FeedBackList(props) {
    const { feedBackList, isLoading, onReFreshFeedBackList, feedBackAvailable } = props;

    const handleDeleteComment = async (MA_DG) => {
        try {
            const { message } = await danhgiaApi.delete(MA_DG);
            if (onReFreshFeedBackList) onReFreshFeedBackList();
            toast.success(message);
        } catch (error) {
            toast.error(error.response.data.message);
            console.log({ error })
        }
    }

    return (
        <ul className='feedback-list'>
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
                        <FeedBack feedBackAvailable={feedBackAvailable} onDelete={handleDeleteComment} key={idx} feedBack={feedBack} />
                    )
            }
        </ul>
    );
}

export default FeedBackList;