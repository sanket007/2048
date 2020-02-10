import React from 'react';

const Horizontal = ({ onLeft, onRight }) => (
    <div>
        <button onClick={onLeft}>&lt;- left</button>
        <button onClick={onRight}>right -&gt;</button>
    </div>
);

export default Horizontal;