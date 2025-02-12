import React from 'react';
import './styles.css';
import Rain from '../Rain';

const Snow = () => {
    return (
        <div className='snow-container'>
            <Rain className='snowing' />
        </div>
    )
};

export default Snow;