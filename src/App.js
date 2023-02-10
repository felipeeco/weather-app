import React from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

function App() {

  const [isLoading, setIsLoading] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [cityWeather, setCityWeather] = React.useState(null);
  const [celsius, setCelsius] = React.useState(true);

  const findCity = (text) =>{
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '1560e30cb2msh9dd021361885e71p14adc4jsn344e1194d7b2',
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
      }
    };
    
    fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?minPopulation=2000000&namePrefix=${text}`, options)
      .then(response => response?.json())
      .then(response => setOptions(response));
  }

  const currentWeather = (cityData) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${cityData[0]?.latitude}&lon=${cityData[0]?.longitude}&appid=9bb5c2a07a3b4d7294d1af9199ce9291`)
      .then(response => response?.json())
      .then(response => setCityWeather(response));
  }

  const convertTemperature = (num) =>{
    if(celsius){
      return Number(num - 273.15).toFixed(0);
    }else{
      return Number(num * 9/5 - 459.67).toFixed(0);
    }
  }

  const date = new Date();

  return (
      <Container>
        <Row>
          <Col xs={12}><h1>City weather</h1></Col>
          <Col xs={12} md={8} className='search-box'>
            <AsyncTypeahead
              id="basic-example"
              isLoading={isLoading}
              placeholder="Write your city"
              minLength={3}
              onSearch={text => findCity(text)}
              options={options?.data}
              labelKey={option => `${option?.city}`}
              onChange={selected => currentWeather(selected)}
            />
          </Col>
          <Row>
            <Col xs={12} md={3} className='result'>
              {cityWeather && (
                <>
                  <Alert variant={'primary'}>
                  Date: <strong>{`${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`}</strong>
                  </Alert>
                </>
              )}
            </Col>
            <Col xs={12} md={3} className='result'>
              {cityWeather && (
                <>
                  <Alert variant={'primary'}>
                  City: <strong>{`${cityWeather?.name}`}</strong>
                  </Alert>
                </>
              )}
            </Col>
            <Col xs={12} md={3} className='result'>
              {cityWeather && (
                <>
                  <Alert variant={'primary'}>
                  Temperature: <strong>{`${convertTemperature(cityWeather?.main?.temp)}`}{celsius ? '°C' : '°F'}</strong>
                  </Alert>
                </>
              )}
            </Col>
          </Row>
        </Row>
        <Row className='button-box'>
          <Col xs={3}>
            <Button onClick={()=> setCelsius(celsius ? false : true)} variant="success">Convert to {celsius ? 'fahrenheit' : 'celsius'}</Button>
          </Col>  
        </Row>
    </Container>
  );
}

export default App;
