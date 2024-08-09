import React,{ useState, useEffect } from 'react';
import { Card,Form, Button, Row, Col,FormCheck } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import "../index.css"
import { FaCircle, FaStar, FaPen, FaPrint } from 'react-icons/fa';
import ExerciseCard from '../components/ExerciseCard.jsx'
import {API_URL} from "./../../config.js"


const DashboardScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const userType = userInfo?.userType;
  const [searchTerm, setSearchTerm] = useState(''); // State variable for search term
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  //console.log(userType);
  useEffect(() => {
    //console.log('User Type:', userType);
    // Fetch exercises data from API
    const fetchExercises = async () => {
      try {
        const response = await fetch(API_URL + '/api/activity', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          //console.log(data);
          setExercises(data);
        } else {
          console.error('Error fetching exercises:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };

    fetchExercises();
  }, []);

  const handleSelectExercise = (id) => {
    setSelectedExercises((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter(exId => exId !== id)  // Deselect if already selected
        : [...prevSelected, id]  // Select if not already selected
    );
  };


  const handleInputChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };
  const filterExercises = () => {
  return exercises.filter(exercise => {
    const matchesSearchTerm = exercise.title.toLowerCase().includes(searchTerm) || exercise.regions.toLowerCase().includes(searchTerm);
    const matchesDifficulty = selectedDifficulty ? exercise.difficulty === selectedDifficulty : true;
    return matchesSearchTerm && matchesDifficulty;
  });
};
  const handleSearch = () => {
    // Implement your search logic here using the searchTerm state
    console.log('Searching for:', searchTerm);
  };
  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const handleRegionChange = (region) => {
    setSearchTerm(region); // Assuming region search
  };

  const handleDeleteSelected = async() => {
    setSelectedExercises([]);
    try {
      const response = await fetch(API_URL+'/api/activity', {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: selectedExercises }),
        credentials: 'include'
      });

      if (response.ok) {
        // Successfully deleted, update state to reflect deletion
        setSelectedExercises([]);
        console.log('Selected exercises deleted successfully.');
      } else {
        console.error('Failed to delete selected exercises.');
      }
    } catch (error) {
      console.error('An error occurred while deleting selected exercises:', error);
    }
  };
  const handleAddToFavorites = async () => {
    try {
      const response = await fetch(API_URL+'/api/activity/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: selectedExercises }),
        credentials: 'include'
      });

      if (response.ok) {
        // Successfully added to favorites, update state to reflect addition
        setSelectedExercises([]);
        console.log('Selected exercises added to favorites successfully.');
      } else {
        console.error('Failed to add selected exercises to favorites.');
      }
    } catch (error) {
      console.error('An error occurred while adding selected exercises to favorites:', error);
    }
  };
  const handleCancelSelection = () => {
    setSelectedExercises([]);
  };

  return (
      <div>
        <Row>          
          <Col xs={7}>
            <Row>
              <Col xs={6}>
                <Form.Control
                id="searchTerm"
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleInputChange}
              />
              </Col>
              <Col xs={6}>
                <Button variant="primary" style={{backgroundColor:'#52b7c5'}} onClick={handleSearch}>
                  Search
                </Button>
              </Col>
            </Row>
          </Col>
          <Col xs={3}>
            {userType==='physio'&&(<Link className="button-link" to="/create-excercise">Add/Upload New Excercise</Link>)}
          </Col>
        </Row>
        {selectedExercises.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mb-3 p-2 bg-light border rounded">
          <span>{selectedExercises.length} exercise(s) selected</span>
          {userType === 'physio' ? (
              <>
                <button onClick={handleDeleteSelected} className="btn btn-danger me-2">
                  Delete Selected
                </button>
                <button onClick={handleCancelSelection} className="btn btn-secondary">
                  Cancel Selection
                </button>
              </>
            ) : (
              <>
                <button onClick={handleAddToFavorites} className="btn btn-primary me-2">
                  Add to Favorites
                </button>
                <button onClick={handleCancelSelection} className="btn btn-secondary">
                  Cancel Selection
                </button>
              </>
            )}
        </div>
      )}
        <Row>
          {exercises.map((exercise, index) => (
          <Col xs={3} key={index}>
            <ExerciseCard 
              key={exercise._id}
              data={exercise}
              onSelectExercise={handleSelectExercise}
              isSelected={selectedExercises.includes(exercise._id)} 
            />
          </Col>
        ))}
        </Row>
        
      </div>
    )

};
export default DashboardScreen;
