import httpx

def test_static_files():
    # Use the port established in metadata
    url = "http://127.0.0.1:8001/static/plots/correlation_matrix.png"
    try:
        response = httpx.get(url)
        print(f"Status: {response.status_code}")
        print(f"Content-Type: {response.headers.get('content-type')}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_static_files()
