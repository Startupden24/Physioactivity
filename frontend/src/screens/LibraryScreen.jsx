import React,{ useState, useEffect } from 'react';
import { Card,Form, Button, Row, Col,FormCheck } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import "../index.css"
import { FaCircle, FaStar, FaPen, FaPrint } from 'react-icons/fa';
import ExerciseCard from '../components/ExerciseCard.jsx'
import {API_URL} from "./../../config.js"


const LibraryScreen = () => {
  const [searchTerm, setSearchTerm] = useState(''); // State variable for search term
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch(API_URL + '/api/activity/public', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
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

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    // Implement your search logic here using the searchTerm state
    console.log('Searching for:', searchTerm);
  };
  const handleSelectExercise = (id) => {
    setSelectedExercises((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter(exId => exId !== id)  // Deselect if already selected
        : [...prevSelected, id]  // Select if not already selected
    );
  };

  return (
      <div>
        <Row>          
          <Col xs={7}>
          <div className="d-flex justify-content-between align-items-center mb-3 p-2 bg-light border rounded">
          <span>Login to Rate activity and maintain favorite activity list</span>
          
        </div>
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
        </Row>
        
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
export default LibraryScreen;
