import { useState } from "react";
import { useCreateRequestMutation } from "@/store/api/Requests/RequestApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const useAddRequest = () => {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const navigation = useNavigate();

  const openMapModal = () => setIsMapOpen(true);
  const closeMapModal = () => setIsMapOpen(false);

  const [formData, setFormData] = useState({
    customer: {
      name: "",
      email: "",
      phone: "",
    },
    requirements: {
      processType: "",
      estateTypes: [],
      city: "",
      neighborhood: "",
      minRooms: "",
      maxRooms: "",
      minSpace: "",
      maxSpace: "",
      price: {
        minUSD: "",
        maxUSD: "",
        minSYP: "",
        maxSYP: "",
      },
    },
  });

  const [errors, setErrors] = useState({});

  const [createRequest, { isLoading }] = useCreateRequestMutation();

  // ===== HANDLE CHANGE (nested like Offers) =====
  const handleChange = (path) => (e) => {
    const value = e.target.value;

    setFormData((prev) => {
      const keys = path.split(".");
      const newData = { ...prev };
      let current = newData;

      keys.forEach((key, i) => {
        if (i === keys.length - 1) {
          current[key] = value;
        } else {
          current[key] = current[key] || {};
          current = current[key];
        }
      });

      return newData;
    });
  };

  // ===== SIMPLE VALIDATION =====
  const validate = () => {
    const newErrors = {};

    if (!formData.customer.name) newErrors.name = "Customer name is required";

    if (!formData.customer.phone) newErrors.phone = "Phone is required";

    if (!formData.requirements.processType)
      newErrors.processType = "Process type required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ===== SUBMIT (same style as Offers) =====
  const handleSubmit = async () => {
    // if (!validate()) return;

    const payload = new FormData();

    // customer
    Object.keys(formData.customer).forEach((key) => {
      payload.append(`customer[${key}]`, formData.customer[key]);
    });

    // requirements (nested)
    Object.keys(formData.requirements).forEach((key) => {
      if (key === "price") {
        Object.keys(formData.requirements.price).forEach((p) => {
          payload.append(
            `requirements[price][${p}]`,
            formData.requirements.price[p],
          );
        });
      } else if (Array.isArray(formData.requirements[key])) {
        formData.requirements[key].forEach((val) => {
          payload.append(`requirements[${key}][]`, val);
        });
      } else {
        payload.append(`requirements[${key}]`, formData.requirements[key]);
      }
    });

    try {
      await createRequest(formData).unwrap();
      toast.success("Request created successfully");
      setTimeout(() => {
        navigation("/Requests");
      },  0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create request");
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    isLoading,
    isMapOpen,
    openMapModal,
    closeMapModal,
  };
};
