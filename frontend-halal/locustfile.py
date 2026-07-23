import os
import time

import requests
from locust import HttpUser, between, task


class HalalDestinasiUser(HttpUser):
    """Smoke-test user for the Laravel backend from the frontend workspace."""

    wait_time = between(1, 3)
    host = os.getenv("LOCUST_HOST", "http://127.0.0.1:8000")

    def on_start(self) -> None:
        for _ in range(20):
            try:
                response = requests.get(f"{self.host}/api/test", timeout=15)
                if response.status_code == 200:
                    return
            except Exception:
                pass
            time.sleep(1)

    @task
    def open_homepage(self) -> None:
        requests.get(f"{self.host}/", timeout=15, name="home")

    @task(2)
    def open_api_test(self) -> None:
        requests.get(f"{self.host}/api/test", timeout=15, name="api-test")
