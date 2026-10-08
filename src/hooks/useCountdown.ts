"use client";

import { useEffect, useState } from "react";

export type CountdownState = {
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
  totalMsRemaining: number;
};

const compute = (expiresAt: string | null): CountdownState => {
  if (!expiresAt) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: false,
      totalMsRemaining: 0,
    };
  }

  const remaining = new Date(expiresAt).getTime() - Date.now();

  if (remaining <= 0) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: true,
      totalMsRemaining: 0,
    };
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours,
    minutes,
    seconds,
    expired: false,
    totalMsRemaining: remaining,
  };
};

export function useCountdown(expiresAt: string | null): CountdownState {
  const [state, setState] = useState<CountdownState>(() => compute(expiresAt));

  useEffect(() => {
    if (!expiresAt) return;

    setState(compute(expiresAt));
    const interval = setInterval(() => {
      setState(compute(expiresAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return state;
}
