// import React from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import { useGetOffersQuery } from "@/store/api/Offers/OffersApi";

// const OffersMapPage = () => {
//   const { data, isLoading, isError, isSuccess } = useGetOffersQuery();

//   if (isLoading) return <div>Loading map...</div>;
//   if (isError) return <div>Error loading offers</div>;
//   if (!isSuccess || !data?.data) return <div>No offers found</div>;

//   const defaultPosition = [33.3152, 44.3661]; // وسط بغداد
//   const firstOffer = data.data[0];
//   const centerPosition = firstOffer
//     ? [firstOffer.location.coordinates[1], firstOffer.location.coordinates[0]]
//     : defaultPosition;

//   return (
//     <div className="w-full h-[600px]">
//       <MapContainer
//         center={centerPosition}
//         zoom={12}
//         scrollWheelZoom={true}
//         style={{ height: "100%", width: "100%" }}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         {data.data.map((offer) => {
//           const position = [
//             offer.location.coordinates[1],
//             offer.location.coordinates[0],
//           ];

//           return (
//             <Marker key={offer._id} position={position}>
//               <Popup>
//                 <div>
//                   <h4 className="font-bold">{offer.title}</h4>
//                   <p>
//                     Price: {offer.price} {offer.currency} <br />
//                     Area: {offer.area} m² <br />
//                     Rooms: {offer.rooms} <br />
//                     Bathrooms: {offer.bathrooms} <br />
//                     City: {offer.city}, {offer.district}
//                   </p>
//                 </div>
//               </Popup>
//             </Marker>
//           );
//         })}
//       </MapContainer>
//     </div>
//   );
// };

// export default OffersMapPage;
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useGetOffersQuery } from "@/store/api/Offers/OffersApi";

const OffersMapPage = () => {
  const { data, isLoading, isError, isSuccess } = useGetOffersQuery();

  if (isLoading) return <div>Loading map...</div>;
  if (isError) return <div>Error loading offers</div>;
  if (!isSuccess || !data?.data) return <div>No offers found</div>;

  const defaultPosition = [33.3152, 44.3661]; // وسط بغداد
  const firstOffer = data.data[0];
  const centerPosition = firstOffer
    ? [firstOffer.location.coordinates[1], firstOffer.location.coordinates[0]]
    : defaultPosition;

  return (
    <div
      className="fixed top-0 left-0 w-full h-full z-[9999]" 
      style={{ backgroundColor: "#f0f0f0" }} // optional background
    >
      <MapContainer
        center={centerPosition}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics"
        />

        {data.data.map((offer) => {
          const position = [
            offer.location.coordinates[1],
            offer.location.coordinates[0],
          ];

          return (
            <Marker key={offer._id} position={position}>
              <Popup>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg">{offer.title}</h4>
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    <div><strong>Price:</strong> {offer.price} {offer.currency}</div>
                    <div><strong>Area:</strong> {offer.area} m²</div>
                    <div><strong>Rooms:</strong> {offer.rooms}</div>
                    <div><strong>Bathrooms:</strong> {offer.bathrooms}</div>
                    <div className="col-span-2"><strong>Location:</strong> {offer.city}, {offer.district}</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default OffersMapPage;