import React, { useState } from 'react';

const Timer = ({ countdown, timerFunction }) => {
  const [seconds, setSeconds] = useState(countdown);

  React.useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      timerFunction();
      console.log("timeout");
    }
  });
  return <>{seconds}</>;
};

export default Timer;
