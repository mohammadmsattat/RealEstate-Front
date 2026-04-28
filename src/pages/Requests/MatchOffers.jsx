import React from 'react'

function MatchOffers() {
  return (
    <div>MatchOffers</div>
  )
}

export default MatchOffers
// import { useParams } from "react-router-dom";
// import Card from "@/components/ui/Card";
// import { useGetMatchingOffersQuery } from "@/store/api/Offers/OffersApi";
// import { useTranslation } from "react-i18next";

// const MatchOffers = () => {
//   const { t } = useTranslation();
//   const { requestNumber } = useParams();

//   const { data, isLoading, isFetching } =
//     useGetMatchingOffersQuery(requestNumber);

//   return (
//     <div className="flex md:space-x-5 relative min-h-screen">
//       <div className="flex-1">
//         <Card
//           className="relative"
//           title="Matching Offers"
//           subtitle={`Results: ${data?.count || 0}`}
//         >
//           {/* LOADING */}
//           {(isLoading || isFetching) && (
//             <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
//               <div className="flex flex-col items-center gap-3">
//                 <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
//                 <span className="text-sm text-gray-600">
//                   {t("common.loading")}
//                 </span>
//               </div>
//             </div>
//           )}

//           <table className="min-w-full divide-y">
//             <thead>
//               <tr>
//                 <th className="table-th">Code</th>
//                 <th className="table-th">Type</th>
//                 <th className="table-th">Price</th>
//                 <th className="table-th">City</th>
//                 <th className="table-th">Rooms</th>
//                 <th className="table-th">Space</th>
//                 <th className="table-th">Match</th>
//               </tr>
//             </thead>

//             <tbody>
//               {data?.estates?.length > 0 ? (
//                 data.estates.map((offer, index) => (
//                   <tr
//                     key={offer._id}
//                     className={`transition hover:bg-slate-50 ${
//                       offer.matchScore > 80
//                         ? "bg-green-50"
//                         : offer.matchScore > 50
//                         ? "bg-yellow-50"
//                         : index % 2 === 0
//                         ? "bg-white"
//                         : "bg-slate-50"
//                     }`}
//                   >
//                     <td className="table-td">{offer.code}</td>
//                     <td className="table-td">{offer.estateType}</td>

//                     <td className="table-td">
//                       {offer.minPrice || offer.price?.minUSD || "--"}
//                     </td>

//                     <td className="table-td">{offer.city}</td>

//                     <td className="table-td">{offer.rooms}</td>

//                     <td className="table-td">{offer.totalSpace}</td>

//                     {/* ⭐ MATCH SCORE */}
//                     <td className="table-td font-bold text-green-600">
//                       {offer.matchScore ? `${offer.matchScore}%` : "--"}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={7} className="text-center py-6 text-slate-500">
//                     No matching offers found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default MatchOffers;