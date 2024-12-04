import React, { useState, useEffect } from "react";
import Floor from "./components/Floor";
import Elevator from "./components/Elevator";
import sound from './assets/sound.mp3';

const App = () => {
  const [elevators, setElevators] = useState([
    { id: 1, currentFloor: 0, isBusy: false, color: 'black' },
    { id: 2, currentFloor: 0, isBusy: false, color: 'black' },
    { id: 3, currentFloor: 0, isBusy: false, color: 'black' },
    { id: 4, currentFloor: 0, isBusy: false, color: 'black' },
    { id: 5, currentFloor: 0, isBusy: false, color: 'black' },
  ]);

  const [floorQueue, setFloorQueue] = useState([]);
  const [buttonStates, setButtonStates] = useState(
    Array(10).fill({ text: 'Call', color: 'green' })
  );

  const playSound = () => {
    const audio = new Audio(sound);
    audio.play();
  };

  const handleCall = (floor) => {
    setFloorQueue((prevData) => [...prevData, floor]);
    setButtonStates((prevData) =>
      prevData.map((state, id) =>
        id === (9 - floor) ? { text: 'Waiting', color: 'red' } : state
      )
    );
  };

  const findNearestElevator = (floor) => {
    const filterFreeEle = elevators.filter((elevator) => !elevator.isBusy);
    return filterFreeEle.reduce(
      (nearest, elevator) => {
        const distance = Math.abs(elevator.currentFloor - floor);
        return distance < nearest.distance
          ? { elevator, distance }
          : nearest;
      },
      { elevator: null, distance: Infinity }
    ).elevator;
  };

  const moveElevator = (elevatorId, targetFloor) => {
    const elevator = elevators.find((e) => e.id === elevatorId);
    if (!elevator) return;

    const startTime = Date.now();

    elevator.isBusy = true;
    elevator.color = 'red';
    setElevators([...elevators]);

    const startFloor = elevator.currentFloor;
    const distance = Math.abs(targetFloor - startFloor);
    const duration = 2000;
    const startMoveTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startMoveTime;
      const progress = Math.min(elapsed / duration, 1);
      elevator.currentFloor = startFloor + (targetFloor - startFloor) * progress;

      setElevators([...elevators]);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        const timeTaken = Date.now() - startTime;
        handleArrival(elevator, targetFloor, timeTaken);
      }
    };

    requestAnimationFrame(animate);
  };

  const handleArrival = (elevator, floor, timeTaken) => {
    elevator.color = 'green';
    setElevators([...elevators]);

    playSound();

    console.log(`Elevator ${elevator.id} took ${timeTaken / 1000} seconds to reach floor ${floor}`);

    setTimeout(() => {

      elevator.color = 'black';
      elevator.isBusy = false;
      setElevators([...elevators]);

      setButtonStates((prevData) =>
        prevData.map((state, id) =>
          id === (9 - floor) ? { text: 'Arrived', color: 'green' } : state
        )
      );

      setTimeout(() => {
        setButtonStates((prevData) =>
          prevData.map((state, id) =>
            id === (9 - floor) ? { text: 'Call', color: 'green' } : state
          )
        );
        setFloorQueue((prevData) => prevData.slice(1));
      }, 1500);
    }, 2000);
  };

  useEffect(() => {
    if (floorQueue.length > 0) {
      const nextFloor = floorQueue[0];
      const elevator = findNearestElevator(nextFloor);
      if (elevator) {
        moveElevator(elevator.id, nextFloor);
      }
    }
  }, [floorQueue]);

  return (
    <div className="flex items-center h-screen justify-center">
      <div className="flex relative flex-col items-center p-4">
        <h1 className="text-4xl ml-4 mb-2 font-semibold">Elevator Exercise</h1>
        <div className="flex flex-col items-center w-1/2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Floor
              key={i}
              floor={i}
              onCall={handleCall}
              buttonState={buttonStates[i]}
            />
          ))}
        </div>
        <div className="flex absolute left-48 top-[84%] justify-center gap-24 mt-8">
          {elevators.map((elevator) => (
            <Elevator key={elevator.id} elevator={elevator} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
