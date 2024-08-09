import React, { useState,useEffect } from 'react';
import { Form, FormGroup, FormControl, Col, Button, Row, InputGroup } from 'react-bootstrap';
import {API_URL} from "./../../config.js"
import "../index.css";
function ExerciseForm() {
  const [title, setTitle] = useState('');
  const [video, setVideo] = useState(null);
  const [image, setImage] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [instructions, setInstructions] = useState('');
  const [regions, setRegions] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);


  useEffect(() => {
    checkFormValidity();
  }, [title, video, image, thumbnail, regions, instructions, difficulty]);
  const checkFormValidity = () => {
    if (
      title &&
      video &&
      image &&
      thumbnail &&
      regions &&
      instructions &&
      difficulty
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('video', video);
    formData.append('image', image);
    formData.append('thumbnail', thumbnail);
    formData.append('instructions', instructions);
    formData.append('regions', regions);
    formData.append('difficulty', difficulty);
    formData.append('isPrivate', isPrivate);
    
    try {
      const response = await fetch(API_URL+'/api/activity', {
        method: 'POST',
        body: formData,
        credentials:'include'
      });

      if (!response.ok) {
        throw new Error(`Error submitting form: ${response.statusText}`);
      }

      // Handle successful submission (e.g., clear form, show success message)
      alert('Exercise submitted successfully!');
      setTitle('');
      setVideo(null);
      setImage(null);
      setThumbnail(null);
      setInstructions('');
      setDifficulty('');
      setIsPrivate(false);
      setRegions('');
    } catch (error) {
      console.error('Error:', error);
      // Handle errors (e.g., display error message)
    }
  };

  const handleVideoChange = (event) => {
    setVideo(event.target.files[0]);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleThumbnailChange = (event) => {
    setThumbnail(event.target.files[0]);
  };

  return (
   <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <FormGroup controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter exercise title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup controlId="formVideo">
            <Form.Label>Video</Form.Label>
            <InputGroup>
              <FormControl type="file" onChange={handleVideoChange} />
            </InputGroup>
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <FormGroup controlId="formImage">
            <Form.Label>Image</Form.Label>
            <InputGroup>
              <FormControl type="file" onChange={handleImageChange} />
            </InputGroup>
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup controlId="formThumbnail">
            <Form.Label>Animated Thumbnail</Form.Label>
            <InputGroup>
              <FormControl type="file" onChange={handleThumbnailChange} />
            </InputGroup>
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <FormGroup controlId="formRegions">
            <Form.Label>Regions</Form.Label>
            <FormControl
              as="textarea"
              rows={3}
              placeholder="Enter body regions for which activity is intended"
              value={regions}
              onChange={(event) => setRegions(event.target.value)}
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup controlId="formInstructions">
            <Form.Label>Instructions</Form.Label>
            <FormControl
              as="textarea"
              rows={3}
              placeholder="Enter exercise instructions"
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
            />
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <FormGroup controlId="formDifficulty">
            <Form.Label>Difficulty</Form.Label>
            <Form.Control
              as="select"
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value)}
            >
              <option value="">Select Difficulty</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </Form.Control>
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup controlId="formPrivate">
            <Form.Check 
              type="checkbox"
              label="Private"
              checked={isPrivate}
              onChange={(event) => setIsPrivate(event.target.checked)}
            />
            <small className="form-text text-muted">
              Public by default
            </small>
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col className="d-flex justify-content-center mt-3">
          <Button type="submit" className="Button" disabled={!isFormValid}>
            Submit Exercise
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default ExerciseForm;
