import { useState } from "react";
import { useCreateOfferMutation } from "@/store/api/Offers/OffersApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export function useAddOffer() {
  const navigation = useNavigate();
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
    location: {
      lat: "",
      lng: "",
    },
    areaUnit: "sqm",
    livingRooms: "",
    totalRooms: "",
    hasElevator: false,
    isNegotiable: false,
    shortDescription: "",
    videoUrl: "",
    virtualTourUrl: "",
    listingExpiryDate: "",
    lastModifiedDate: "",
    closedDate: "",
    nearbyPlaces: {
      schools: 0,
      hospitals: 0,
      malls: 0,
      restaurants: 0,
      metro: 0,
    },
  });

  const [features, setFeatures] = useState({
    hasBalcony: false,
    hasPool: false,
    hasGarage: false,
    hasAC: false,
    hasSecurity: false,
    hasGarden: false,
    hasParking: false,
    hasStorage: false,
    hasHeating: false,
    hasFurnished: false,
    hasJacuzzi: false,
    hasSauna: false,
    hasGym: false,
    hasSeaView: false,
    hasLandmarkView: false,
    isPetFriendly: false,
  });

  const [files, setFiles] = useState({
    mainImage: null,
    images: [],
    files: [],
    videoFiles: [],
  });

  const [errors, setErrors] = useState({});

  const [createOffer] = useCreateOfferMutation();

  const validateField = (field, value) => {
    switch (field) {
      case "title":
        if (!value) return "Title is required";
        if (value.length < 5) return "Minimum 5 characters";
        if (value.length > 200) return "Max 200 characters";
        return "";

      case "description":
        if (!value) return "Description is required";
        if (value.length > 5000) return "Max 5000 characters";
        return "";

      case "price":
        if (!value) return "Price is required";
        if (Number(value) <= 0) return "Price must be greater than 0";
        return "";

      case "totalSpace":
        if (!value) return "Total space is required";
        if (Number(value) <= 0) return "Must be greater than 0";
        return "";

      case "city":
        if (!value) return "City is required";
        return "";

      case "neighborhood":
        if (!value) return "Neighborhood is required";
        return "";

      case "agentEmail":
        if (value && !/^\S+@\S+\.\S+$/.test(value))
          return "Invalid email format";
        return "";

      default:
        return "";
    }
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;

    setFormData((prev) => ({ ...prev, [field]: value }));

    const error = validateField(field, value);

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleFeature = (key) => {
    setFeatures({ ...features, [key]: !features[key] });
  };

  const setLatLng = (latlng) => {
    setFormData((prev) => ({
      ...prev,
      location: { lat: latlng.lat, lng: latlng.lng },
    }));
  };

  const validateForm = () => {
    let newErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async () => {
  // if (!validateForm()) return;

  const form = new FormData();

  Object.keys(formData).forEach((key) => {
    if (key === "nearbyPlaces") {
      Object.keys(formData.nearbyPlaces).forEach((np) =>
        form.append(`nearbyPlaces[${np}]`, formData.nearbyPlaces[np])
      );
    } else if (key === "location") {
      // إرسال lat و lng بشكل منفصل للبقاء متوافقاً مع الموديل
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
    const res = await createOffer(form).unwrap();
    toast.success("Offer added successfully");
    setTimeout(() => {
      navigation("/offers");
    }, 1500);
  } catch (err) {
    toast.error("Failed to add offer");
    console.error("ERROR:", err);
  }
};

  return {
    formData,
    features,
    files,
    errors,
    setFiles,
    handleChange,
    handleFeature,
    setLatLng,
    handleSubmit,
  };
}
