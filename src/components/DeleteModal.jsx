import React from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  isError = false,
  errorMessage = "",
  isSuccess = false,
  title = "Confirm Delete",
  itemName = "",
}) => {
  return (
    <Modal
      title={title}
      uncontrol={false}
      activeModal={isOpen}
      onClose={onClose}
      centered
      className="max-w-md"
      footerContent={
        <>
          <Button
            text="Cancel"
            className="btn-outline-dark"
            onClick={onClose}
          />
          <Button
            text={isLoading ? "Deleting..." : "Delete"}
            className="btn-danger"
            onClick={onConfirm}
            disabled={isLoading}
          />
        </>
      }
    >
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Are you sure you want to delete <strong>{itemName}</strong>? This action
        cannot be undone.
      </p>

      {isError && (
        <p className="text-red-500 mt-2">{errorMessage || "Delete failed"}</p>
      )}
    </Modal>
  );
};

export default DeleteModal;
