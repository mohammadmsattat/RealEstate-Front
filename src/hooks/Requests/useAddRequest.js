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
    requestNumber: "",
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

    const requiredFields = [
      {
        key: "requestNumber",
        value: formData.requestNumber,
        label: "Request Number",
      },

      {
        key: "estateTypes",
        value: formData.requirements.estateTypes?.length > 0,
        label: "Property Type",
      },

      {
        key: "processType",
        value: formData.requirements.processType,
        label: "Operation Type",
      },

      {
        key: "city",
        value: formData.requirements.city,
        label: "City",
      },
    ];

    for (const field of requiredFields) {
      const isEmpty =
        field.value === undefined ||
        field.value === null ||
        field.value === "" ||
        field.value === false;

      if (isEmpty) {
        newErrors[field.key] = `${field.label} is required`;
      }
    }

    setErrors(newErrors);

    const firstError = Object.values(newErrors)[0];

    if (firstError) {
      toast.error(firstError);
      return false;
    }

    return true;
  };

  // ===== SUBMIT (same style as Offers) =====
 const handleSubmit = async () => {
  if (!validate()) return;

  // ✅ إرسال JSON عادي بدل FormData
  const payload = {
    requestNumber: formData.requestNumber,

    customer: {
      ...formData.customer,
    },

    requirements: {
      ...formData.requirements,

      // تنظيف وتحويل بعض القيم
      minRooms: formData.requirements.minRooms
        ? Number(formData.requirements.minRooms)
        : null,

      maxRooms: formData.requirements.maxRooms
        ? Number(formData.requirements.maxRooms)
        : null,

      minSpace: formData.requirements.minSpace
        ? Number(formData.requirements.minSpace)
        : null,

      maxSpace: formData.requirements.maxSpace
        ? Number(formData.requirements.maxSpace)
        : null,

      price: {
        minUSD: formData.requirements.price.minUSD
          ? Number(formData.requirements.price.minUSD)
          : null,

        maxUSD: formData.requirements.price.maxUSD
          ? Number(formData.requirements.price.maxUSD)
          : null,

        minSYP: formData.requirements.price.minSYP
          ? Number(formData.requirements.price.minSYP)
          : null,

        maxSYP: formData.requirements.price.maxSYP
          ? Number(formData.requirements.price.maxSYP)
          : null,
      },
    },
  };

  console.log("Request Payload:", payload);

  try {
    await createRequest(payload).unwrap();

    toast.success("Request created successfully");

    setTimeout(() => {
      navigation("/Requests");
    }, 0);
  } catch (err) {
    console.error(err);

    toast.error(
      err?.data?.message || "Failed to create request"
    );
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
