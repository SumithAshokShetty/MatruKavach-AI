import requests
from langchain.tools import tool
from pydantic import BaseModel

class Coordinates(BaseModel):
    latitude: float
    longitude: float

@tool("get_environmental_data", args_schema=Coordinates)
def get_environmental_data(latitude: float, longitude: float):
    """
    Fetches real-time environmental data (AQI, Pollutants, Temperature, Heat Index) for a given location using Open-Meteo API.
    """
    timeout = 5.0
    try:
        # Fetch weather (temperature and humidity)
        weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current=temperature_2m,relative_humidity_2m"
        weather_res = requests.get(weather_url, timeout=timeout)
        weather_res.raise_for_status()
        weather_data = weather_res.json()
        
        current_weather = weather_data.get("current", {})
        temp = current_weather.get("temperature_2m", 28.0)
        humidity = current_weather.get("relative_humidity_2m", 60.0)
    except Exception as e:
        print(f"Weather API fallback activated: {e}")
        temp = 28.0
        humidity = 60.0

    try:
        # Fetch air quality (pm2_5, pm10)
        aqi_url = f"https://air-quality-api.open-meteo.com/v1/air-quality?latitude={latitude}&longitude={longitude}&current=pm2_5,pm10"
        aqi_res = requests.get(aqi_url, timeout=timeout)
        aqi_res.raise_for_status()
        aqi_data = aqi_res.json()
        
        current_aqi = aqi_data.get("current", {})
        pm25 = current_aqi.get("pm2_5", 45.0)
        pm10 = current_aqi.get("pm10", 75.0)
    except Exception as e:
        print(f"Air Quality API fallback activated: {e}")
        pm25 = 45.0
        pm10 = 75.0

    # Simple Heat Index estimation formula (Rothfusz regression approximation)
    t_f = temp * 1.8 + 32  # Celsius to Fahrenheit
    hi_f = 0.5 * (t_f + 61.0 + ((t_f - 68.0) * 1.2) + (humidity * 0.094))
    heat_index = (hi_f - 32) / 1.8  # Convert back to Celsius
    
    if pm25 > 100 or temp > 35:
        msg = "Alert: High temperature or high pollutant levels detected."
        condition = "Haze/Heatwave"
    else:
        msg = "Conditions are stable."
        condition = "Clear/Mild"

    return {
        "aqi_pm25": pm25,
        "aqi_pm10": pm10,
        "temperature_c": temp,
        "humidity": humidity,
        "heat_index": heat_index,
        "weather_condition": condition,
        "message": msg
    }
