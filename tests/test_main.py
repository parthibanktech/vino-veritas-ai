from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Vino Veritas Wine Quality API"}

def test_get_features():
    response = client.get("/features")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0
    assert "feature" in response.json()[0]
    assert "importance" in response.json()[0]

def test_predict_invalid():
    # Test with missing data
    response = client.post("/predict", json={})
    assert response.status_code == 422
