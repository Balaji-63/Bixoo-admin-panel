import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_login_success():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/auth/login", data={"username": "ops@bixoo.com", "password": "password"})
    assert response.status_code == 200
    assert "access_token" in response.json()
