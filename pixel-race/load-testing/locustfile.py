from locust import HttpUser, between

class SSEUser(HttpUser):
    wait_time = between(1, 2)

    def on_start(self):
        self.client.post("/init", json={"username":"foo", "password":"bar"})