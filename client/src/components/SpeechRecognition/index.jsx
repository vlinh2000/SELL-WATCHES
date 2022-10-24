import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import './SpeechRecognition.scss';

SpeechReconigtion.propTypes = {

};

function SpeechReconigtion(props) {
    const { visible, onSwitchModal, contentListened, isError, onSearchVoice, isListening } = props;

    const handleOffSpeechRecognition = () => {
        if (!onSwitchModal) return;
        onSwitchModal(false);
    }

    const handleSearchVoice = () => {
        if (!onSearchVoice) return;
        onSearchVoice();
    }

    return (
        <div className='speech-recognition'>
            <Modal
                // style={{ minHeight: 200 }}
                // maskStyle={{ background: 'none' }}
                onCancel={handleOffSpeechRecognition}
                footer={false}
                title=""
                centered
                visible={visible}>
                <div className='content-speech-recognition-modal'>
                    <div className='content-listening'>
                        {
                            !isError ? (contentListened || 'Đang nghe ...') : 'Tôi chưa nghe rõ. Mời bạn nói lại.'
                        }
                    </div>
                    <Button shape='circle' style={{ cursor: isListening ? 'not-allowed' : 'pointer' }} className={`voice-btn ${isListening ? 'active' : ''}`} size='large' type='primary' onClick={isListening ? null : handleSearchVoice}>
                        <AudioOutlined />
                    </Button>

                    {
                        !isListening &&
                        <div className='try-again'>
                            Nhấn vào micrô để thử lại
                        </div>
                    }
                </div>

            </Modal>
        </div>
    );
}

export default SpeechReconigtion;