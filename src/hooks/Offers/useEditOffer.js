import { useEffect, useState } from "react";
import {
  useGetOfferByIdQuery,
  useUpdateOfferMutation,
} from "@/store/api/Offers/OffersApi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export function useEditOffer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetOfferByIdQuery(id);
  const [updateOffer] = useUpdateOfferMutation();

  const [formData, setFormData] = useState({
    title: "",
    code: "",
    description: "",
    processType: "for_sale",
    estateType: "apartment",
    city: "",
    neighborhood: "",
    address: "",
    totalSpace: "",
    builtArea: "",
    landArea: "",
    bedrooms: "",
    bathrooms: "",
    floorNumber: "",
    totalFloors: "",
    price: "",
    pricePerMeter: "",
    currency: "USD",
    paymentType: "cash",
    downPayment: "",
    installmentMonths: "",
    propertyCondition: "good",
    yearBuilt: "",
    furnishingStatus: "unfurnished",
    agentName: "",
    agentPhone: "",
    agentEmail: "",
    ownerName: "",
    ownerNumber: "",
    location: { lat: "", lng: "" },
    listingExpiryDate: "",
    closedDate: "",
  });

  const [features, setFeatures] = useState({});
  const [files, setFiles] = useState({
    mainImage: null,
    images: [],
    files: [],
    videoFiles: [],
  });

  // ✅ Fill data from backend
  useEffect(() => {
    if (!data?.data) return;

    const offer = data.data;

    setFormData({
      ...offer,
      location: offer.location || { lat: "", lng: "" },
    });

    setFeatures(offer.features || {});
  }, [data]);

  // ================= handlers =================
  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleFeature = (key) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const setLatLng = (latlng) => {
    setFormData((prev) => ({
      ...prev,
      location: { lat: latlng.lat, lng: latlng.lng },
    }));
  };

  // ================= submit =================
  const handleSubmit = async () => {
    const form = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "location") {
        form.append("location[lat]", formData.location.lat);
        form.append("location[lng]", formData.location.lng);
      } else if (formData[key] !== "" && formData[key] !== null) {
        form.append(key, formData[key]);
      }
    });

    Object.keys(features).forEach((key) =>
      form.append(`features[${key}]`, String(features[key]))
    );

    if (files.mainImage) form.append("mainImage", files.mainImage);
    files.images.forEach((f) => form.append("images", f));
    files.files.forEach((f) => form.append("files", f));
    files.videoFiles.forEach((f) => form.append("videoFiles", f));

    try {
      await updateOffer({ id, data:form }).unwrap();
      toast.success("Offer updated successfully");
      navigate("/offers");
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    }
  };

  return {
    formData,
    features,
    files,
    isLoading,
    handleChange,
    handleFeature,
    setFiles,
    setLatLng,
    handleSubmit,
  };
}