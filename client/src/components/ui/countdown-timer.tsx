import { useState, useEffect } from "react";

interface CountdownTimerProps {
  endTime: Date;
  onEnd?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endTime, onEnd }) => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endTime.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft("Ended");
        if (onEnd) {
          onEnd();
        }
        return;
      }
      
      // Calculate remaining time
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      // Format the time
      const formattedHours = String(hours).padStart(2, '0');
      const formattedMinutes = String(minutes).padStart(2, '0');
      const formattedSeconds = String(seconds).padStart(2, '0');
      
      setTimeLeft(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
    };
    
    // Initial calculation
    calculateTimeLeft();
    
    // Setup interval
    const timerId = setInterval(calculateTimeLeft, 1000);
    
    // Cleanup
    return () => clearInterval(timerId);
  }, [endTime, onEnd]);

  return (
    <span className={`font-poppins font-semibold ${isExpired ? 'text-red-500' : ''}`}>
      {timeLeft}
    </span>
  );
};

export default CountdownTimer;
