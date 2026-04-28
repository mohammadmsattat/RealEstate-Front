import { useParams } from "react-router-dom";
import Card from "@/components/ui/Card";
import { useTranslation } from "react-i18next";
import { useMatchRequestWithOffersQuery } from "@/store/api/Requests/RequestApi";

const MatchOffers = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const { data, isLoading, isFetching } = useMatchRequestWithOffersQuery(id);

  const responseData = data?.data;
  const offers = responseData?.offers || [];
  const totalMatches = responseData?.totalMatches || 0;
  const request = responseData?.request;

  return (
    <div className="flex md:space-x-5 relative min-h-screen">
      <div className="flex-1">
        <Card
          className="relative"
          title="Matching Offers"
          subtitle={
            request
              ? `Request: ${request.requestNumber} | Results: ${totalMatches}`
              : `Results: ${totalMatches}`
          }
        >
          {/* LOADING */}
          {(isLoading || isFetching) && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
                <span className="text-sm text-gray-600">
                  {t("common.loading")}
                </span>
              </div>
            </div>
          )}

          <table className="min-w-full divide-y">
            <thead>
              <tr>
                <th className="table-th">Code</th>
                <th className="table-th">Type</th>
                <th className="table-th">City</th>
                <th className="table-th">Neighborhood</th>
                <th className="table-th">Price (USD)</th>
                <th className="table-th">Rooms</th>
                <th className="table-th">Space</th>
                <th className="table-th">Status</th>
              </tr>
            </thead>

            <tbody>
              {offers.length > 0 ? (
                offers.map((offer, index) => (
                  <tr
                    key={offer._id}
                    className={`transition hover:bg-slate-100 ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50"
                    }`}
                  >
                    <td className="table-td font-medium">
                      {offer.offerNumber || offer.code || "--"}
                    </td>
                    <td className="table-td">{offer.estateType || "--"}</td>
                    <td className="table-td">{offer.city || "--"}</td>
                    <td className="table-td">{offer.neighborhood || "--"}</td>
                    <td className="table-td">
                      {offer.price?.minUSD != null &&
                      offer.price?.maxUSD != null
                        ? `$${offer.price.minUSD.toLocaleString()} - $${offer.price.maxUSD.toLocaleString()}`
                        : offer.price?.minSYP != null &&
                            offer.price?.maxSYP != null
                          ? `SYP ${offer.price.minSYP.toLocaleString()} - ${offer.price.maxSYP.toLocaleString()}`
                          : "--"}
                    </td>
                    <td className="table-td">{offer.rooms || "--"}</td>
                    <td className="table-td">
                      {offer.totalSpace ? `${offer.totalSpace} m²` : "--"}
                    </td>
                    <td className="table-td">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          offer.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : offer.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {offer.status || "--"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-slate-500">
                    No matching offers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};

export default MatchOffers;
