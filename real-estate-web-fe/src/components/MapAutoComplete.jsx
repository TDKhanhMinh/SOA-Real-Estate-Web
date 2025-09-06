import React, { useState } from "react";
import ReactMapGL, { Marker, NavigationControl } from "@goongmaps/goong-map-react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import TextInput from "./TextInput";


const GOONG_MAPTILES_KEY = "ZJrUrOf5fwOvZxzLVV4KmTPTsqhCkmvh0uVRruyY";
const GOONG_PLACES_KEY = "KeONrT42qDbhvyFK5oLjywhE0EAcrxeHh0NTznDz";

export default function MapAutoComplete({ onSelect }) {
    const [viewport, setViewport] = useState({
        latitude: 10.762622,
        longitude: 106.660172,
        zoom: 16,
    });

    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [marker, setMarker] = useState(null);
    const [isShowMap, setIsShowMap] = useState(false);

    const handleSearch = async (e) => {
        const value = e.target.value;
        setQuery(value);
        if (value.length > 2) {
            const res = await axios.get(
                `https://rsapi.goong.io/Place/AutoComplete?api_key=${GOONG_PLACES_KEY}&input=${value}`
            );
            setSuggestions(res.data.predictions || []);
        } else {
            setSuggestions([]);
        }
    };

    const handleSelectPlace = async (place) => {
        const res = await axios.get(
            `https://rsapi.goong.io/Place/Detail?place_id=${place.place_id}&api_key=${GOONG_PLACES_KEY}`
        );
        const location = res.data.result.geometry.location;

        const data = {
            description: res.data.result.formatted_address,
            latitude: location.lat,
            longitude: location.lng,
        };

        setMarker({ latitude: location.lat, longitude: location.lng });
        setViewport({
            ...viewport,
            latitude: location.lat,
            longitude: location.lng,
            zoom: 16,
        });
        setIsShowMap(true);
        setQuery(place.description);
        setSuggestions([]);

        if (onSelect) {
            onSelect(data);
        }
    };

    return (
        <div className="">
            <div className="w-full z-10 bg-white rounded-3xl shadow">
                <TextInput
                    type="text"
                    value={query}
                    onChange={handleSearch}
                    placeholder="Tìm địa điểm..."
                    className="w-full inline-block p-2 border border-gray-300 rounded-3xl"
                />
                {suggestions.length > 0 && (
                    <ul className="mt-2 border border-gray-200 rounded max-h-60 overflow-y-auto bg-white">
                        {suggestions.map((s, i) => (
                            <li
                                key={i}
                                onClick={() => handleSelectPlace(s)}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                            >
                                {s.description}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {isShowMap && (
                <div className="flex items-center mt-4 w-full h-[300px]">
                    <ReactMapGL
                        {...viewport}
                        width="100%"
                        height="100%"
                        goongApiAccessToken={GOONG_MAPTILES_KEY}
                        onViewportChange={(next) => setViewport(next)}
                    >
                        {marker && (
                            <Marker latitude={marker.latitude} longitude={marker.longitude}>
                                <FontAwesomeIcon
                                    icon={faLocationDot}
                                    style={{ fontSize: "28px", color: "red" }}
                                />
                            </Marker>
                        )}
                        <div style={{ position: "absolute", right: 40, top: 10 }}>
                            <NavigationControl showCompass={false} />
                        </div>
                    </ReactMapGL>
                </div>
            )}
        </div>
    );
}
