import React from 'react';
import './ProcessBar.css';

export default function ProgressBar(props) {
    return (
        <div className='progress-bar'>
            <div className='title'>
                {props.title}
            </div>

            <div className='processor'>
                <div
                    className='Percent'
                    style={{
                        width: `${props.percentage}%`,
                        backgroundColor: props.isCanceled ? '#ff6b6b' : '#4CAF50'
                    }}
                >
                    <span className="progress-text">
                        {props.isCanceled ? 'Canceled' : `${props.percentage}%`}
                    </span>
                </div>
            </div>
            <div className='Cancel'>
                {!props.isCanceled && (
                    <button className="cancel-button" onClick={props.onCancel}>
                        Отмена
                    </button>
                )}
            </div>
        </div>
    );
}