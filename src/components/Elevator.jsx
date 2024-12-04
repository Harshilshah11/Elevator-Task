import React from 'react'
import ElevatorIcon from '@mui/icons-material/Elevator';

const Elevator = ({ elevator }) => {
    const { currentFloor, color } = elevator;
    return (
        <span style={{
            transform: `translateY(-${currentFloor * 7.675}vh)`,
            transition: 'transform 1s linear',
        }} className={`${color === 'red' ? 'text-red-500' : color === 'green' ? 'text-green-500' : 'text-black'}`} ><ElevatorIcon style={{ fontSize: '3.5rem' }}></ElevatorIcon></span>

    )
}

export default Elevator
