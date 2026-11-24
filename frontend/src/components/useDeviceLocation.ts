import { useCallback, useEffect, useRef } from "react";

interface Options {
    onUpdate: (lat: number, lng: number, accuracy: number) => void;
    onDone: (bestAccuracy: number) => void;
    onError: (message: string) => void;
}

const GOOD_ACCURACY_M = 25;
const MAX_WATCH_MS = 20000;

export function useDeviceLocation({ onUpdate, onDone, onError }: Options) {
    const callbacks = useRef({ onUpdate, onDone, onError });
    useEffect(() => {
        callbacks.current = { onUpdate, onDone, onError };
    });

    const watchId = useRef<number | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const best = useRef<number>(Infinity);

    const stop = useCallback((report: boolean) => {
        if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
        if (timer.current) clearTimeout(timer.current);
        watchId.current = null;
        timer.current = null;
        if (report && best.current !== Infinity) callbacks.current.onDone(best.current);
    }, []);

    const locate = useCallback(() => {
        const fail = (msg: string) => setTimeout(() => callbacks.current.onError(msg), 0);

        if (!("geolocation" in navigator)) {
            fail("This browser does not support location.");
            return;
        }
        if (!window.isSecureContext) {
            fail("Location only works on https:// or http://localhost. Open the site via localhost, or use Set Location.");
            return;
        }

        stop(false);
        best.current = Infinity;

        watchId.current = navigator.geolocation.watchPosition(
            (pos) => {
                const { latitude, longitude, accuracy } = pos.coords;
                if (accuracy >= best.current) return;
                best.current = accuracy;
                callbacks.current.onUpdate(latitude, longitude, accuracy);
                if (accuracy <= GOOD_ACCURACY_M) stop(true);
            },
            (err) => {
                if (err.code === err.TIMEOUT && best.current !== Infinity) {
                    stop(true);
                    return;
                }
                stop(false);
                if (err.code === err.PERMISSION_DENIED) {
                    fail("Location permission is blocked. Allow it in your browser's site settings, then try again.");
                } else if (err.code === err.POSITION_UNAVAILABLE) {
                    fail("Your device couldn't determine its location. Use Set Location instead.");
                } else {
                    fail("Getting your location timed out. Try again or use Set Location.");
                }
            },
            { enableHighAccuracy: true, maximumAge: 0, timeout: MAX_WATCH_MS },
        );

        timer.current = setTimeout(() => stop(true), MAX_WATCH_MS);
    }, [stop]);

    useEffect(() => () => stop(false), [stop]);

    return { locate };
}
