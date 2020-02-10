import React from 'react';

const SingleBlock = ({ value }) => {
    return (
        <div className="single-block">{value > 0 ? value : ''}</div>
    )
}

export default SingleBlock;