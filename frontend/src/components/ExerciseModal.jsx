import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ExerciseModal = ({ show, handleClose, exerciseData, handleSaveChanges, userType }) => {
  const [editableData, setEditableData] = useState({ ...exerciseData });

  useEffect(() => {
    setEditableData({ ...exerciseData });
  }, [exerciseData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditableData({
      ...editableData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{userType === 'physio' ? 'Edit Exercise' : 'View Exercise'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="d-flex align-items-center mb-3">
            <img
              src={editableData.thumbnailLink}
              alt="Thumbnail"
              className="me-3"
              style={{ width: '100px', height: 'auto' }}
            />
            <Form.Group controlId="formTitle" className="flex-grow-1">
              <Form.Label>Title</Form.Label>
              {userType === 'physio' ? (
                <Form.Control
                  type="text"
                  name="title"
                  value={editableData.title}
                  onChange={handleChange}
                />
              ) : (
                <p>{editableData.title}</p>
              )}
            </Form.Group>
          </div>

          <div className="mb-3">
            <video
              controls
              src={editableData.videoLink}
              className="w-100"
              style={{ maxHeight: '300px' }}
            >
              Your browser does not support the video tag.
            </video>
          </div>

          <Form.Group controlId="formDescription" className="mb-3">
            <Form.Label>Description</Form.Label>
            {userType === 'physio' ? (
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={editableData.instructions}
                onChange={handleChange}
              />
            ) : (
              <p>{editableData.description}</p>
            )}
          </Form.Group>

          <Form.Group controlId="formRegions" className="mb-3">
            <Form.Label>Regions</Form.Label>
            {userType === 'physio' ? (
              <Form.Control
                type="text"
                name="regions"
                value={editableData.regions}
                onChange={handleChange}
              />
            ) : (
              <p>{editableData.regions}</p>
            )}
          </Form.Group>

          <Form.Group controlId="formPrivacy" className="mb-3">
            <Form.Check
              type="checkbox"
              name="isPrivate"
              label="Private"
              checked={editableData.isPrivate}
              onChange={handleChange}
              disabled={userType !== 'physio'}
            />
          </Form.Group>

          

          <div className="mb-3">
            <Form.Label>Image Link</Form.Label>
            <div>
              <img
                src={editableData.imageLink}
                alt="Image"
                className="w-100"
                style={{ maxHeight: '300px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        {userType === 'physio' && (
          <Button variant="primary" onClick={() => handleSaveChanges(editableData)}>
            Save Changes
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ExerciseModal;
