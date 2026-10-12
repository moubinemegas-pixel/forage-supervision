import { useState, useEffect, useRef, useCallback } from "react";

export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

interface UseWaterLevelResult {
  level: number;
  status: ConnectionStatus;
  error: string | null;
  url: string;
  setUrl: (url: string) => void;
  connect: () => void;
  disconnect: () => void;
  alertTriggered: boolean;
}

const ALERT_THRESHOLD = 85;
const POLL_INTERVAL = 1000;

const useWaterLevel = (): UseWaterLevelResult => {
  const [level, setLevel] = useState<number>(0);
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string>("");
  const [alertTriggered, setAlertTriggered] = useState<boolean>(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const alertPlayedRef = useRef<boolean>(false);

  const clearPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const fetchLevel = useCallback(async () => {
    if (!url) return;

    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const text = await response.text();
      const parsed = parseInt(text.trim(), 10);

      if (isNaN(parsed) || parsed < 0 || parsed > 100) {
        throw new Error("Valeur reçue invalide");
      }

      setLevel(parsed);
      setError(null);
      setStatus("connected");

      if (parsed >= ALERT_THRESHOLD) {
        setAlertTriggered(true);
        if (!alertPlayedRef.current && audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
          alertPlayedRef.current = true;
        }
      } else {
        setAlertTriggered(false);
        if (alertPlayedRef.current && audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          alertPlayedRef.current = false;
        }
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur de connexion inconnue";
      setError(message);
      setStatus("error");
    }
  }, [url]);

  const connect = useCallback(() => {
    if (!url) {
      setError("Veuillez saisir une adresse URL valide");
      setStatus("error");
      return;
    }

    setStatus("connecting");
    setError(null);
    clearPolling();

    fetchLevel();

    intervalRef.current = setInterval(fetchLevel, POLL_INTERVAL);
  }, [url, fetchLevel, clearPolling]);

  const disconnect = useCallback(() => {
    clearPolling();
    setStatus("disconnected");
    setError(null);
    setLevel(0);
    setAlertTriggered(false);
    alertPlayedRef.current = false;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [clearPolling]);

  useEffect(() => {
    audioRef.current = new Audio("/alarme_pleine.mp3");
    audioRef.current.preload = "auto";

    return () => {
      clearPolling();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [clearPolling]);

  return {
    level,
    status,
    error,
    url,
    setUrl,
    connect,
    disconnect,
    alertTriggered,
  };
};

export default useWaterLevel;