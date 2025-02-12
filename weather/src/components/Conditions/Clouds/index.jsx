import React from 'react';
import './styles.css';

const Cloud = ({ cloudGroup, cloudClass, count }) => {
    return (
        <div className={`clouds ${cloudGroup}`}>
            {[...Array(count)].map((_, i) => (
                <div className={cloudClass} key={i}></div>
            ))}
        </div>
    )
};

export default Cloud;