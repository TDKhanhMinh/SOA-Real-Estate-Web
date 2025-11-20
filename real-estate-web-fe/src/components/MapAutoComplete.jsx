import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import TextInput from "./TextInput";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const GOONG_PLACES_KEY = "KeONrT42qDbhvyFK5oLjywhE0EAcrxeHh0NTznDz";

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function MapAutoComplete({ onSelect }) {
  const [viewport, setViewport] = useState({
    lat: 10.762622,
    lng: 106.660172,
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

    setMarker({ lat: location.lat, lng: location.lng });
    setViewport({
      lat: location.lat,
      lng: location.lng,
      zoom: 18,
    });
    setIsShowMap(true);
    setQuery(place.description);
    setSuggestions([]);

    if (onSelect) {
      console.log("location selected", data);

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
        <div className="flex items-center mt-4 w-full h-[300px] z-10">
          <MapContainer
            center={[viewport.lat, viewport.lng]}
            zoom={viewport.zoom}
            style={{ width: "100%", height: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            />
            {marker && (
              <Marker position={[marker.lat, marker.lng]}>
                <Popup>
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    style={{ fontSize: "18px", color: "red" }}
                  />{" "}
                  {query}
                </Popup>
              </Marker>
            )}
            <ChangeView center={[viewport.lat, viewport.lng]} zoom={viewport.zoom} />
          </MapContainer>
        </div>
      )}
    </div>
  );
}
