from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import ObjectId

load_dotenv()

app = FastAPI()

# Database Connection (Direct access for simplicity in this agent context)
# In a real microservice, this might be separate, but for "MCP" style aggregation, it's fine.
MONGO_URI = os.getenv("MONGO_URI", "mongodb://loca") # Default to local if not set
client = MongoClient(MONGO_URI)
db = client.get_database("ringmaster")

class TripRequest(BaseModel):
    destination: str
    days: int

@app.get("/")
def read_root():
    return {"message": "Ringmaster AI Agent is running"}

@app.post("/plan-trip")
def plan_trip(request: TripRequest):
    destination = request.destination
    days = request.days
    
    # 1. Fetch Weather (Mocking for now if no key, or using OpenWeatherMap if key exists)
    weather_data = get_weather(destination)
    
    # 2. Fetch Route/Map Info (Mocking or using OSRM)
    route_data = get_route_info(destination)
    
    # 3. Fetch Local Recommendations from DB
    hotels = get_hotels(destination)
    events = get_events(destination)
    
    # 4. Generate Itinerary (Simple rule-based)
    itinerary = generate_itinerary(destination, days, events)
    
    # 5. Budget Estimate
    budget = estimate_budget(days, hotels, route_data)

    return {
        "destination": destination,
        "weather": weather_data,
        "route": route_data,
        "hotels": hotels,
        "events": events,
        "itinerary": itinerary,
        "budget": budget
    }

def get_weather(city: str):
    api_key = os.getenv("OPENWEATHER_API_KEY")
    if not api_key:
        return {"temp": "25°C", "condition": "Sunny (Mock)", "humidity": "60%", "forecast": ["Sunny", "Cloudy", "Rain"]}
    
    try:
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
        response = requests.get(url)
        data = response.json()
        
        if response.status_code == 200:
            return {
                "temp": f"{data['main']['temp']}°C",
                "condition": data['weather'][0]['description'],
                "humidity": f"{data['main']['humidity']}%",
                "forecast": ["Sunny", "Cloudy", "Rain"] # Forecast API requires paid or different endpoint, keeping mock for now
            }
        else:
            return {"temp": "N/A", "condition": "Unavailable", "humidity": "N/A", "forecast": []}
    except Exception as e:
        print(f"Weather API Error: {e}")
        return {"temp": "25°C", "condition": "Sunny (Mock Fallback)", "humidity": "60%", "forecast": ["Sunny", "Cloudy", "Rain"]}

def get_coordinates(city: str):
    try:
        url = f"https://nominatim.openstreetmap.org/search?q={city}&format=json&limit=1"
        headers = {'User-Agent': 'RingmasterAgent/1.0'}
        response = requests.get(url, headers=headers)
        if response.status_code == 200 and response.json():
            data = response.json()[0]
            return float(data['lon']), float(data['lat'])
        return None
    except Exception as e:
        print(f"Geocoding Error: {e}")
        return None

def get_route_info(destination_city: str):
    origin_city = "New Delhi" # Default origin
    
    origin_coords = get_coordinates(origin_city)
    dest_coords = get_coordinates(destination_city)
    
    if not origin_coords or not dest_coords:
        return {
            "distance": "Unknown",
            "duration": "Unknown",
            "mode": "Road (Calculation Failed)",
            "description": "Could not geocode cities."
        }
        
    try:
        # OSRM API: /route/v1/driving/{lon},{lat};{lon},{lat}
        url = f"http://router.project-osrm.org/route/v1/driving/{origin_coords[0]},{origin_coords[1]};{dest_coords[0]},{dest_coords[1]}?overview=false"
        response = requests.get(url)
        data = response.json()
        
        if response.status_code == 200 and data['code'] == 'Ok':
            route = data['routes'][0]
            distance_km = route['distance'] / 1000
            duration_hours = route['duration'] / 3600
            
            return {
                "distance": f"{distance_km:.1f} km",
                "duration": f"{duration_hours:.1f} hours",
                "mode": "Road",
                "description": f"Driving from {origin_city} to {destination_city}"
            }
        else:
             return {
                "distance": "Unknown",
                "duration": "Unknown",
                "mode": "Road",
                "description": "Route not found."
            }
            
    except Exception as e:
        print(f"Routing Error: {e}")
        return {
            "distance": "Unknown",
            "duration": "Unknown",
            "mode": "Road",
            "description": "Routing service unavailable."
        }

def get_hotels(city):
    # Case-insensitive regex search
    hotels = list(db.hotels.find({"city": {"$regex": city, "$options": "i"}}).limit(3))
    # Convert ObjectId to string
    for hotel in hotels:
        hotel["_id"] = str(hotel["_id"])
        if "owner" in hotel: hotel["owner"] = str(hotel["owner"])
    return hotels

def get_events(city):
    events = list(db.events.find({"city": {"$regex": city, "$options": "i"}}).limit(3))
    for event in events:
        event["_id"] = str(event["_id"])
        if "organizer" in event: event["organizer"] = str(event["organizer"])
    return events

def generate_itinerary(city, days, events):
    itinerary = []
    for i in range(1, days + 1):
        activities = [f"Explore {city}"]
        if i == 1:
            activities.append("Arrival and check-in")
            activities.append("Visit local markets")
        elif i == 2 and events:
            activities.append(f"Attend {events[0]['type']} at {events[0]['place']}")
            activities.append("Try local cuisine")
        elif i == days:
            activities.append("Souvenir shopping")
            activities.append("Departure preparations")
        else:
            activities.append("Sightseeing")
            activities.append("Local experiences")
        
        itinerary.append({
            "day": i,
            "activities": activities
        })
    return itinerary

def estimate_budget(days, hotels, route):
    # Very rough estimation
    avg_hotel_price = 100 # Default
    if hotels:
        avg_hotel_price = sum(h.get('price_per_night', 100) for h in hotels) / len(hotels)
    
    accommodation_cost = avg_hotel_price * days
    food_cost = 50 * days  # $50 per day for food
    activities_cost = 30 * days  # $30 per day for activities
    travel_cost = 50  # Base travel cost
    
    total = accommodation_cost + food_cost + activities_cost + travel_cost
    
    return {
        "total": f"${total:.2f}",
        "breakdown": {
            "accommodation": f"${accommodation_cost:.2f}",
            "food": f"${food_cost:.2f}",
            "activities": f"${activities_cost:.2f}",
            "travel": f"${travel_cost:.2f}"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
