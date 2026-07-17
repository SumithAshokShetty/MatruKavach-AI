from langchain.tools import tool
from pydantic import BaseModel, Field
import random

class Coordinates(BaseModel):
    latitude: float
    longitude: float

@tool("get_environmental_data", args_schema=Coordinates)
def get_environmental_data(latitude: float, longitude: float):
    """
    Fetches real-time environmental data (AQI, Pollutants, Weather) for a given location.
    Currently mocks data for demonstration purposes.
    """

    is_polluted_zone = (latitude > 18.0 and latitude < 20.0) 
    
    if is_polluted_zone:
        return {
            "aqi_pm25": random.uniform(150, 300), 
            "aqi_pm10": random.uniform(200, 400),
            "temperature_c": random.uniform(30, 38),
            "humidity": random.uniform(70, 90),
            "heat_index": random.uniform(40, 50), 
            "weather_condition": "Haze/Heatwave",
            "message": "Severe Heatwave and Pollution Alert"
        }
    else:
        return {
            "aqi_pm25": random.uniform(30, 80), 
            "aqi_pm10": random.uniform(50, 100),
            "temperature_c": random.uniform(25, 30),
            "humidity": random.uniform(50, 70),
            "heat_index": random.uniform(28, 32), 
            "weather_condition": "Clear Sky",
            "message": "Conditions are stable"
        }
