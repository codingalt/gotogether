import React, { useEffect, useRef, useState } from 'react'
import css from './SelectSeat.module.scss';
import * as fa from 'react-icons/fa'
import SelectFare from '../SelectFare/SelectFare';

const SelectSeats = ({
  seatsCard,
  setSeatsCard,
  totalSeats,
  seatCost,
  campaignId,
  driverId,
}) => {
  const seatRef = useRef(null);
  const [seatCard, setSeatCard] = useState(false);
  const [seats, setSeats] = useState(1);

  const handleSubmit = () => {
    setSeatsCard(false);
    setSeatCard(true);
  };

  const inreamentSeats = () => {
    if (seats >= totalSeats) {
      setSeats(parseInt(totalSeats));
    } else {
      setSeats(seats + 1);
    }
  };

  const decreamentSeats = () => {
    if (seats <= 1) {
      setSeats(1);
    } else {
      setSeats(seats - 1);
    }
  };

  useEffect(() => {
    const handler = (event) => {
      if (!seatRef.current?.contains(event.target)) {
        setSeatsCard(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);
  return (
    <>
      <SelectFare
        seatsCard={seatCard}
        seats={seats}
        setSeatsCard={setSeatCard}
        seatCost={seatCost}
        setSeats={setSeats}
        campaignId={campaignId}
        driverId={driverId}
      />
      <div
        className={
          !seatsCard ? css.wrapper : `${css.wrapper} ${css.activeCard}`
        }
      >
        <div className={css.card} ref={seatRef}>
          <div className={css.line}></div>
          <h3>How many seats do you want to book?</h3>

          <div className={css.selectSeats}>
            <button
              disabled={seats === 1}
              style={seats === 1 ? { background: "gray", color: "#fff" } : {}}
              onClick={decreamentSeats}
              className={css.decrease}
            >
              <fa.FaMinus />
            </button>
            <div className={css.seats}>{seats}</div>
            <button
              disabled={seats === parseInt(totalSeats)}
              style={
                seats === parseInt(totalSeats)
                  ? { background: "gray", color: "#fff" }
                  : {}
              }
              onClick={inreamentSeats}
              className={css.increase}
            >
              <fa.FaPlus />
            </button>
          </div>

          <button className={css.requestBtn} onClick={handleSubmit}>
            Done
          </button>
        </div>
      </div>
    </>
  );
};

export default SelectSeats