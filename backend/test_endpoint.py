import requests

try:
    res = requests.post("http://localhost:8000/auth/login", json={"username": "admin", "password": "adminpassword"})
    print("Status code:", res.status_code)
    print("Response JSON:", res.json())
except Exception as e:
    print("Error connecting to server:", e)
