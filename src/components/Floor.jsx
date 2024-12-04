import React from 'react'

const Floor = ({ floor, onCall, buttonState }) => {
  const { text, color } = buttonState;

  const floorId = 9 - floor

  return (
    <div className="flex items-center gap-4">
      <span className='w-32 text-center font-bold'>{floorId === 0 ? "Ground Floor" : `${floorId}th`}</span>

      <div className='flex items-center'>
        {
          Array.from({ length: 5 }).map((_, id) => (
            <div key={id} className='w-36 h-14 border'></div>
          ))
        }
      </div>

      <button
        onClick={() => onCall(floorId)}
        className={`py-2  px-2 w-20 rounded text-black font-bold text-xl ${color === 'red'
          ? 'bg-red-500 cursor-not-allowed'
          : color === 'green'
            ? 'bg-green-400'
            : 'bg-gray-500'
          }`}
        disabled={text === 'Waiting'}
      >
        {text}
      </button>
    </div>
  )
}

export default Floor;