/** @jsx jsx */
/* @jsxFrag React.Fragment */
import { Global, css, jsx } from '@emotion/core';
import React from 'react';

function zerofill(number) {
  if (number >= 0 && number <= 9) {
    return `0${number}`;
  }

  return number;
}

export default function TimeCounter() {
  const [seconds, setSeconds] = React.useState(60 * 5);
  const [active, setActive] = React.useState(false);

  const changeTimeEventHandler = React.useCallback(
    (e) => {
      if (e.keyCode === 37) {
        setSeconds(seconds - 1);
      } else if (e.keyCode === 39) {
        setSeconds(seconds + 1);
      }
    },
    [seconds],
  );

  const changeActiveEventHandler = React.useCallback(
    (e) => {
      if (e.keyCode === 32) setActive(!active);
    },
    [active],
  );

  React.useEffect(() => {
    document.addEventListener('keyup', changeActiveEventHandler);
    document.addEventListener('keydown', changeTimeEventHandler);

    return () => {
      document.removeEventListener('keyup', changeActiveEventHandler);
      document.removeEventListener('keydown', changeTimeEventHandler);
    };
  }, [active, changeActiveEventHandler, changeTimeEventHandler]);

  React.useEffect(() => {
    if (!active) return;

    const handleId = setInterval(() => {
      setSeconds(seconds - 1);
    }, 1000);

    return () => clearInterval(handleId);
  }, [seconds, active]);

  const background = React.useMemo(() => {
    if (seconds > 60) {
      return '#3DFD0C';
    } else if (seconds >= 0) {
      return '#DAFE0F';
    } else if (seconds < 0) {
      return '#D81221';
    }
  }, [seconds]);

  const timerValue = React.useMemo(() => {
    const mins = Math.floor(Math.abs(seconds) / 60);
    const secs = zerofill(Math.floor(Math.abs(seconds) % 60));
    return `${mins}:${secs}`;
  }, [seconds]);

  return (
    <>
      <Global
        styles={css`
          body {
            padding: 0;
            margin: 0;

            background-color: ${background};
          }
        `}
      />

      <div
        css={css`
          color: #fff;
          min-height: 100vh;

          display: flex;
          justify-content: center;
          align-items: center;

          font-size: 10em;
          font-weight: bold;
          font-family: Arial, Helvetica, sans-serif;
        `}
      >
        {timerValue}
      </div>
    </>
  );
}
