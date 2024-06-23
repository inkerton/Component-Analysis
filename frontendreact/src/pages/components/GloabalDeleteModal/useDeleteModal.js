import { useState } from "react";

const useDeleteModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const toggleModal = () => setShowModal((prev) => !prev);

  const deleteHandler = async (deleteFunction) => {
    if (selectedItem) {
      await deleteFunction("delete", selectedItem);
      setSelectedItem(null);
      setShowModal(false);
    }
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  return {
    showModal,
    toggleModal,
    selectedItem,
    handleDelete,
    deleteHandler,
  };
};

export default useDeleteModal;
