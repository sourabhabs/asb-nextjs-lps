"use client";

import { useEffect, useState } from "react";

export default function AdmissionsTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const calculateTimeLeft = () => {
      const now = new Date();
      // First target date: July 22, 2026, 23:59:59
      let targetDate = new Date("2026-07-22T23:59:59");
      
      // Dynamic logic: reset every 5 days after July 22
      while (now > targetDate) {
        targetDate.setDate(targetDate.getDate() + 5);
      }
      
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      
      return { days, hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const pad = (num: number) => String(num).padStart(2, "0");

  const timerItems = [
    { label: "DAY", value: mounted ? pad(timeLeft.days) : "00" },
    { label: "HRS", value: mounted ? pad(timeLeft.hours) : "00" },
    { label: "MINS", value: mounted ? pad(timeLeft.minutes) : "00" },
    { label: "SECS", value: mounted ? pad(timeLeft.seconds) : "00" },
  ];

  return (
    <div className="admissions-timer-container">
      <h3 className="admissions-timer-title">Admissions closing soon!</h3>
      <div className="admissions-timer-digits-row">
        {timerItems.map((item, idx) => (
          <div key={item.label} className="admissions-timer-item-group">
            <div className="admissions-timer-card-wrapper">
              <div className="admissions-timer-card">
                <span className="admissions-timer-digit">{item.value}</span>
              </div>
              <span className="admissions-timer-label">{item.label}</span>
            </div>
            {idx < 3 && <span className="admissions-timer-colon">:</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
