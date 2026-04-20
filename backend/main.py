from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import math

app = FastAPI()

# ✅ Enable CORS (for React frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Load world data
with open("data/world_data.json") as f:
    world_data = json.load(f)


# ✅ Distance function (OUTSIDE everything)
def get_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km

    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)

    a = (
        math.sin(dLat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dLon / 2) ** 2
    )

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c


# ✅ Home route
@app.get("/")
def home():
    return {"message": "API Running"}


# ✅ Get all countries
@app.get("/countries")
def get_countries():
    return world_data


# ✅ Target calculation API
@app.get("/targets/{country_name}/{missile_name}")
def get_targets(country_name: str, missile_name: str):

    # Find country
    country = next(
        (c for c in world_data if c["name"].lower() == country_name.lower()),
        None,
    )

    if not country:
        return {"error": "Country not found"}

    # Check missiles exist
    if "missiles" not in country:
        return {"error": "No missiles data for this country"}

    # Find missile
    missile = next(
        (m for m in country["missiles"] if m["name"] == missile_name),
        None,
    )

    if not missile:
        return {"error": "Missile not found"}

    targets = []

    # Calculate targets
    for c in world_data:
        if c["name"] == country["name"]:
            continue

        distance = get_distance(
            country["capital"]["lat"],
            country["capital"]["lng"],
            c["capital"]["lat"],
            c["capital"]["lng"],
        )

        if distance <= missile["range"]:
            targets.append(
                {
                    "country": c["name"],
                    "capital": c["capital"]["name"],
                    "lat": c["capital"]["lat"],
                    "lng": c["capital"]["lng"],
                    "distance_km": round(distance),
                }
            )

    return targets