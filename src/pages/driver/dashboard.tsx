import GoogleMapReact from "google-map-react";
import { API_KEY } from "../../common/constants";
import React, { useEffect, useState } from "react";
import { gql, useMutation, useSubscription } from "@apollo/client";
import { Link, useHistory } from "react-router-dom";
import { FULL_ORDER_FRAGMENT } from "../../gql/fragments";
import { COOCKED_ORDERS_SUBSCRIPTION, TAKE_ORDER_MUTATION } from "../../gql/gql-query";
import { coockedOrders } from "../../__generated__/coockedOrders";
import { takeOrder, takeOrderVariables } from "../../__generated__/takeOrder";

interface ICoords {
    lat: number;
    lng: number;
}

interface IDriverProps {
    lat: number;
    lng: number;
    $hover?: any;
}
const Driver: React.FC<IDriverProps> = () => (<div className="text-xl">🛵</div>);

export const Dashboard = () => {

    // Wait for cooked order
    const { data: cookedOrdersData } = useSubscription<coockedOrders>(COOCKED_ORDERS_SUBSCRIPTION);
    useEffect(() => {
        if (cookedOrdersData?.cookedOrders.id) {
            // makeRoute();
            console.log(cookedOrdersData);
        }
    }, [cookedOrdersData]);

    // Accept Order
    const history = useHistory();
    const [takeOrderMutation] = useMutation<takeOrder, takeOrderVariables>(
        TAKE_ORDER_MUTATION
    );
    const onCompleted = (data: takeOrder) => {
        if(data.takeOrder.ok) {
            history.push(`/orders/${cookedOrdersData?.cookedOrders.id}`);
        }
    }
    const onAcceptClick = () => {
        if(cookedOrdersData) {
            takeOrderMutation({
                variables: {
                    input: {
                        id: cookedOrdersData?.cookedOrders.id
                    }
                },
                onCompleted
            });
        }
    }

    // GOOGLE MAPS API
    // const onApiLoaded = ({ map, maps }: { map: any, maps: any }) => {
    //     map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    //     setMap(map);
    //     setMaps(maps);
    // }
    // const [driverCoords, setDriverCoords] = useState<ICoords>({ lat: 10.3255415, lng: 103.856341 });
    // const [map, setMap] = useState<google.maps.Map>();
    // const [maps, setMaps] = useState<any>();
    // const onSuccess = (position: any) => {
    //     const { coords: { latitude, longitude } } = position;
    //     setDriverCoords({ lat: latitude, lng: longitude });
    // }
    // const onError = (error: any) => {
    //     console.log(error)
    // }
    // useEffect(() => {
    //     // @ts-ignore
    //     navigator.geolocation.watchPosition(onSuccess, onError, {
    //         enableHighAccuracy: true,
    //     });
    // }, [])
    // useEffect(() => {
    //     if (map && maps) {
    //         map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    //         // const geocoder = new google.maps.Geocoder();
    //         // geocoder.geocode(
    //         //     { location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng), },
    //         //     (results, status) => {
    //         //         console.log(status, results);
    //         //     }
    //         // )
    //     }
    // }, [driverCoords.lat, driverCoords.lng]);

    // const makeRoute = (() => {
    //     if (map) {
    //         const directionsService = new google.maps.DirectionsService();
    //         const directionsRenderer = new google.maps.DirectionsRenderer({
    //             polylineOptions: { strokeColor: "#000", icons: [] },
    //         });
    //         directionsRenderer.setMap(map);
    //         directionsService.route(
    //             {
    //                 origin: { location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng) },
    //                 destination: { location: new google.maps.LatLng(driverCoords.lat + 0.05, driverCoords.lng + 0.07) },
    //                 travelMode: google.maps.TravelMode.DRIVING,
    //             },
    //             (result, status) => {
    //                 if (status === google.maps.DirectionsStatus.OK) {
    //                     directionsRenderer.setDirections(result);
    //                 } else {
    //                     console.log(status, result);
    //                 }
    //             }
    //         )
    //     }
    // })
    // console.log(driverCoords);

    return (
        <div>
            <div className="overflow-hidden bg-gray-800"
                style={{ width: window.innerWidth, height: "50vh" }}
            >
                {/* <GoogleMapReact
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={onApiLoaded}
                    defaultZoom={16}
                    defaultCenter={{
                        lat: 10.3255415,
                        lng: 103.856341,
                    }}
                    bootstrapURLKeys={{ key: API_KEY }}
                >
                    {/* <Driver lat={driverCoords.lat} lng={driverCoords.lng} /> 
                </GoogleMapReact> */}
            </div>
            <div className="max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
                {cookedOrdersData?.cookedOrders.restaurant ? (
                    <>
                        <h1 className="text-center text-3xl font-medium">New Cooked Order</h1>
                        <h4 className="text-center my-3 text-2xl font-medium">Pick it up soon @ {cookedOrdersData?.cookedOrders.restaurant?.name}</h4>
                        <button onClick={onAcceptClick} className="btn w-full block text-center mt-5">Accept Challenge &rarr;</button>
                    </>
                ) : (
                    <h1 className="text-center text-3xl font-medium">No order yet.</h1>
                )
                }
            </div>
        </div>
    ); 
}