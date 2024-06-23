import React from "react";
import { Modal, ModalBody } from "reactstrap";
import { Icon } from "../../../components/Component";
import { Button } from "../../../components/Component";

const DeleteModal = ({ isOpen, toggle, onDelete }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} className="modal-dialog-centered">
      <ModalBody className="modal-body-lg text-center">
        <div className="nk-modal">
          <Icon className="nk-modal-icon icon-circle icon-circle-xxl ni ni-cross bg-danger"></Icon>
          <h4 className="nk-modal-title">Confirm</h4>
          <div className="nk-modal-text">
            <p className="lead">Once deleted, the data can't be recovered.</p>
          </div>
          <div className="nk-modal-action mt-4 d-flex justify-content-around">
            {/* Return button */}
            <Button color="light" size="lg" className="btn-mw mr-3" onClick={toggle}>
              Return
            </Button>
            {/* Confirm button with danger theme */}
            <Button color="danger" size="lg" className="btn-mw" onClick={onDelete}>
              Confirm
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default DeleteModal;
