import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card } from 'react-bootstrap';
import { FaRegCircle, FaCircle, FaRegStar, FaStar, FaEdit } from 'react-icons/fa';
import "../index.css";
import ExerciseModal from './ExerciseModal';
import { API_URL } from "./../../config.js";

const ExerciseCard = ({ data, onSelectExercise, isSelected }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [currentRating, setCurrentRating] = useState(data.averageRating || 0);
  const { userInfo } = useSelector((state) => state.auth);
  const userType = userInfo?.userType || 'guest';

  const handleRateExercise = async (rating) => {
    if (userType === 'patient') {
      setCurrentRating(rating);
      console.log('Rated exercise:', data._id, 'Rating:', rating);
      try {
        const response = await fetch(`${API_URL}/api/activity/rating/${data._id}?rate=${rating}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          console.log('Exercise rated successfully.');
        } else {
          console.error('Failed to rate exercise.');
        }
      } catch (error) {
        console.error('An error occurred while rating the exercise:', error);
      }

    }
  };

  const handleEditExercise = (exerciseId) => {
    setSelectedExercise(data); // You may want to fetch data based on ID if it's not already available
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedExercise(null);
  };

  const handleSaveChanges = async (updatedData) => {
    // Implement the logic to save the changes (e.g., send a request to the server)
    console.log('Saved changes:', updatedData);
    try {
      const response = await fetch(API_URL + '/api/activity', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData),
        credentials: 'include'
      });

      if (response.ok) {
        const updatedExercise = await response.json();
        setSelectedExercise(null);
        console.log('Exercise updated successfully.');
      } else {
        console.error('Failed to update exercise.');
      }
    } catch (error) {
      console.error('An error occurred :', error);
    }
    setShowModal(false);
  };

  return (
    <>
     <Card style={{ width: '15rem', margin: '1rem' }} className="exercise-card">
      <div className="d-flex align-items-center justify-content-between">
        {userType !== 'guest' && (
          <div className="icons">
            {isSelected ? (
              <FaCircle
                className="me-2"
                size={30}
                color="#52b7c5"
                title="Deselect exercise"
                onClick={() => onSelectExercise(data._id)}
              />
            ) : (
              <FaRegCircle
                className="me-2"
                size={30}
                color="#52b7c5"
                title="Select exercise"
                onClick={() => onSelectExercise(data._id)}
              />
            )}
          </div>
        )}
        {/*<div className="text-center">
          {userType === 'patient' && (
            <FaRegStar
              className="m-2"
              size={30}
              color="#52b7c5"
              title="Rate exercise"
              onClick={() => handleRateExercise(data._id)}
            />
          )}
        </div>*/}
        <div className="icons">
          {userType === 'physio' && (
          <FaEdit
            className="ms-2"
            size={30}
            color="#52b7c5"
            title="Edit exercise"
            onClick={() => handleEditExercise(data._id)}
          />
        )}
          {userType === 'patient' && (
          <FaEdit
            className="ms-2"
            size={30}
            color="#52b7c5"
            title="Edit exercise"
            onClick={() => handleEditExercise(data._id)}
          />
        )}
        </div>
      </div>
      <div className="image-container position-relative">
        <Card.Img
          variant="top"
          src={data.imageLink ? data.imageLink : "https://via.placeholder.com/150"}
          alt={data.title}
        />
      </div>
      <Card.Body>
        <Card.Title className="text-center text-wrap">{data.title}</Card.Title>
        <div className="d-flex justify-content-center mt-2">
          {Array.from({ length: 5 }, (v, i) => (
            <FaStar
              key={i}
              color={i < currentRating ? "gold" : "lightgrey"}
              onClick={() => userType === 'patient' && handleRateExercise(i + 1)}
              style={{ cursor: userType === 'patient' ? 'pointer' : 'default' }}
            />
          ))}
        </div>
      </Card.Body>
    </Card>
      {selectedExercise && (
        <ExerciseModal
          show={showModal}
          handleClose={handleCloseModal}
          exerciseData={selectedExercise}
          handleSaveChanges={handleSaveChanges}
          userType={userType}
        />
      )}
    </>
  );
};

export default ExerciseCard;
