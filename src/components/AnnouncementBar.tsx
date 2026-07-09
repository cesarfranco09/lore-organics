import { useState, useEffect } from "react";

const LAUNCH_DATE = new Date("2026-10-01T00:00:00Z");

const daysUntilLaunch = () => {
  const now = new Date();
  const diff = LAUNCH_DATE.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const AnnouncementBar = () => {
  const [days, setDays] = useState(daysUntilLaunch());

  useEffect(() => {
    const interval = setInterval(() => {
      setDays(daysUntilLaunch());
    }, 1000 * 60 * 60); // update every hour
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex items-center justify-center h-[40px] text-xs tracking-wide"
      style={{ backgroundColor: "#1A3528", color: "#F7F5F1" }}
    >
      <span className="text-center px-4">
        Launching in {days} days · October 1st 2026
      </span>
    </div>
  );
};

export default AnnouncementBar;
