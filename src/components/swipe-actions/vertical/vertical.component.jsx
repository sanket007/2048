import React from 'react';

const Vertical = ({ onUp, onDown }) => (
    <div>
        <button onClick={onUp}>^ Up</button>
        <button onClick={onDown}>Down v</button>
    </div>
);

export default Vertical;