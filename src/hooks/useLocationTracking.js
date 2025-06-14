import { useEffect, useRef, useState } from 'react';
import Geolocation from '@react-native-community/geolocation';
import firestore from '@react-native-firebase/firestore';
import dayjs from 'dayjs';

const useLocationTracking = (taskId, heading, deliveryStarted, agentId) => {
    const [distanceTravelled, setDistanceTravelled] = useState(0);
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const watchId = useRef(null);
    const prevLatLng = useRef(null);

    useEffect(() => {
        if (heading === 'Delivery Address' && deliveryStarted) {
            startTracking();
        } else {
            stopTracking();
        }
        return () => stopTracking();
    }, [heading, deliveryStarted]);

    const startTracking = () => {
        watchId.current = Geolocation.watchPosition(
            async (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                console.log('accuracy', accuracy)
                // if (accuracy > 20) return;
                const timestamp = dayjs().format('DD, MMMM YYYY hh:mm:ss A');
                const newLatLng = { latitude, longitude, timestamp };

                if (prevLatLng.current) {
                    const dist = calculateDistance(prevLatLng.current, newLatLng);
                    if (dist < 0.01) return; // < 10 meters (0.01 km), ignore jitter
                    setDistanceTravelled(prev => prev + dist);
                }

                prevLatLng.current = newLatLng;
                setRouteCoordinates(prev => {
                    const updatedCoords = [...prev, newLatLng];
                    // Store updated coordinates in Firestore
                    saveCoordinatesToFirestore(updatedCoords);
                    return updatedCoords;
                });
                // const updatedCoords = [...routeCoordinates, newLatLng];
                // setRouteCoordinates(updatedCoords);
                // saveCoordinatesToFirestore(updatedCoords);
            },
            (error) => console.log('Location error:', error),
            {
                enableHighAccuracy: true,
                distanceFilter: 10,
                interval: 3000,
                fastestInterval: 2000,
                forceRequestLocation: true,
            }
        );
    };

    const stopTracking = () => {
        if (watchId.current !== null) {
            Geolocation.clearWatch(watchId.current);
            console.log("STOP")
            watchId.current = null;
            prevLatLng.current = null;
        }
    };

    const calculateDistance = (start, end) => {
        const toRad = (value) => (value * Math.PI) / 180;
        const R = 6371; // Radius of Earth in KM
        const dLat = toRad(end.latitude - start.latitude);
        const dLon = toRad(end.longitude - start.longitude);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(start.latitude)) *
            Math.cos(toRad(end.latitude)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        console.log("RRRR", R * c)
        return R * c;
    };

    const saveCoordinatesToFirestore = async (coords) => {
        if (!taskId || !agentId) return;

        const taskRef = firestore().collection('tasks').doc(taskId);
        const agentRef = firestore().collection('deliveryAgents').doc(agentId);

        try {
            await taskRef.update({ routeCoordinates: coords });

            const agentDoc = await agentRef.get();
            if (agentDoc.exists) {
                const data = agentDoc.data();
                const updatedOrders = (data.completedOrders || []).map(order => {
                    if (order.taskId === taskId) {
                        return { ...order, routeCoordinates: coords };
                    }
                    return order;
                });

                await agentRef.update({ completedOrders: updatedOrders });
            }
        } catch (error) {
            console.error('Error saving coordinates:', error);
        }
    };

    return { distanceTravelled, routeCoordinates };
};

export default useLocationTracking;
