# X-Scraper

X-Scraper is a project that scrapes trending topics from X (formerly Twitter) while rotating IPs using **Tor** (with an option to use **ProxyMesh**).  
The project consists of a **Node.js backend** (with Selenium + Chrome for automation) and a **React.js frontend** styled with Tailwind CSS.  
MongoDB is used for storing cookies and scraped trends.

---

## Project Structure

```
x-scraper/
│
├── backend/
│   ├── models/models.js
│   ├── scripts/script.js
│   ├── tor/torrc
│   ├── utils/util.js
│   ├── Dockerfile
│   └── server.js
│
├── frontend/   (React project with Tailwind CSS)
```

---

## Setup Instructions

### Prerequisites

- Docker installed
- MongoDB instance running (local or cloud, e.g., MongoDB Atlas)

### Backend Setup

1. **Create environment file**  
   Copy `.env.sample` → `.env` and fill in required values.

2. **Build Docker image**

   ```bash
   docker build -t x-scraper-backend .
   ```

3. **Run Docker container**
   ```bash
   docker run -p 4000:4000 --env-file .env x-scraper-backend
   ```

---

### Tor Configuration

- Default Tor control password: `password123`
- To change it:
  1. Enter the container shell:
     ```bash
     docker exec -it <container_id> sh
     ```
  2. Run:
     ```bash
     tor --hash-password <your_chosen_password>
     ```
  3. Copy the generated hash and replace the value in `backend/tor/torrc` under `HashedControlPassword`.

---

### Frontend Setup

1. Navigate to the frontend project folder.
2. Update API URLs in the code to point to:
   ```
   http://localhost:4000
   ```
3. Start the React development server as usual:
   ```bash
   npm install
   npm start
   ```

---

## API Endpoints

Base URL (local): `http://localhost:4000`

- `GET /get-trends` → Fetch latest trends
- `POST /refresh-cookies` → Refresh cookies (must be called manually via Postman initially)
- `GET /recents` → Fetch recently saved trends
- `DELETE /recents/:id` → Delete a particular record

---

## PUBLIC HOSTED BACKEND ENDPOINT

https://sixth-sense-assignment.onrender.com

## Approach

- **Problem:** Logging in with rotating IPs caused Google Sign-In to trigger captchas (which cannot be automated). Normal account creation also failed due to X’s restrictions.
- **Solution:**
  - Used **cookies** instead of logging in repeatedly.
  - Login once locally → Save cookies in MongoDB.
  - Selenium reuses these cookies across different IPs.
  - Only need to refresh cookies every 1–2 weeks via `/refresh-cookies`.

---

## Challenges Faced

The biggest challenge was figuring out how to rotate the IP efficiently. I first tried **ProxyMesh**, but the free tier was too limited and got exhausted after just a few calls. That’s when I discovered I could use **Tor** for IP rotation. I hooked Tor into the Node.js server and passed it as a proxy to Chrome, which worked smoothly.

After solving IP rotation, another problem came up: when logging in with different IPs, **Google Sign-In** kept throwing captchas—which obviously can’t be automated. On top of that, X wasn’t letting me create a normal account.

The workaround I found was to skip logging in each time and instead use **cookies**. I logged in once on my local IP, saved the cookies to the DB, and then whenever the IP rotated, Selenium just reapplied those cookies. This way it directly logs in without going through the captcha flow. The only catch is that cookies expire after 1–2 weeks, so they need to be refreshed periodically.

---

## Notes

- Before calling `/refresh-cookies`, ensure the following environment variables are set:
  - `X_EMAILADDRESS`
  - `X_PASSWORD`
  - `X_USERNAME` (sometimes required for login)

---

## Database

MongoDB is used to store:

- **Cookies** (for session persistence)
- **Trends** (scraped data)

 <img width="1621" height="615" alt="image" src="https://github.com/user-attachments/assets/7c68cd10-a0be-4bb8-bac9-bd54ed154229" />
 
_<img width="1595" height="647" alt="image" src="https://github.com/user-attachments/assets/ea625ef8-652f-4bd2-b51a-cc30bf739883" />

---
