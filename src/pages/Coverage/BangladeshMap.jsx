import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";

const position = [23.685, 90.3563]; // Center of Bangladesh

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function FlyToDistrict({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 10, { duration: 1.5 });
    }
  }, [coords, map]);
  return null;
}

const BangladeshMap = ({ coverageData }) => {
  const [searchText, setSearchText] = useState("");
  const [activeCoords, setActiveCoords] = useState(null);
  

  const handleSearch = (e) => {
    e.preventDefault();
    const district = coverageData.find((d) =>
      d.district.toLowerCase().includes(searchText.toLowerCase())
    );
    if (district) {
      setActiveCoords([district.latitude, district.longitude]);
      
    } else {
      setActiveCoords(null);
   
    }
  };

  return (
    <div className="w-full">
      {/* 🔍 Search Bar (outside map) */}
      <div className="max-w-md mx-auto mt-4 mb-4 px-4">
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            placeholder="Search district..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md outline-none"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button
            type="submit"
            className="bg-primary text-black px-4 py-2 rounded-r-md hover:cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* 🗺️ Map */}
      <div className="h-[800px] w-full rounded-xl overflow-hidden shadow-lg">
        <MapContainer
          center={position}
          zoom={7.8}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FlyToDistrict coords={activeCoords} />

          {coverageData.map((center, index) => (
            <Marker
              key={index}
              position={[center.latitude, center.longitude]}
              icon={customIcon}
            >
              <Popup>
                <strong>{center.district}</strong>
                <br />
                {center.covered_area.join(", ")}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default BangladeshMap;
