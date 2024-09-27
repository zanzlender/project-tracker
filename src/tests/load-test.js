import http from "k6/http";
import { check, sleep } from "k6";

// Test configuration
export const options = {
  vus: 10,
  duration: "20s",
  thresholds: {
    // Assert that 99% of requests finish within 3000ms.
    http_req_duration: ["p(99) < 300"],
    // less than 1% of http errors
    http_req_failed: ["rate<0.01"],
  },
  // Ramp the number of virtual users up and down
  /*  stages: [
    { duration: "30s", target: 15 },
    { duration: "1m", target: 15 },
    { duration: "20s", target: 0 },
  ], */
};

const URL = "https://projectplanner.online/api/webhooks/clerk";

// Simulated user behavior
export default function () {
  const res = http.get(URL);

  // Validate response status
  check(res, {
    "status was 200": (r) => r.status == 200,

    "duration was": (r) => r.timings.duration < 300,
  });
  sleep(1);
}
