import React, { useState } from 'libs/react';
import './app.css'

const App = () => {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        setCount(e => e + 1)
    }

    return (
        <div className='about-counter' onClick={handleClick}>
            About1:    {count}
        </div>
    )
}

export default App