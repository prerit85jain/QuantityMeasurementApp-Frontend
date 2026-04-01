# Quantity Measurement App — Full Stack

A full-stack application built with **Spring Boot (backend)** and **React + Vite (frontend)**.

Supports: Length · Temperature · Volume · Weight  
Operations: Convert · Compare · Add · Subtract · Divide  
Auth: JWT (register/login) · Google OAuth2 · GitHub OAuth2

---

## 📁 Project Structure

```
QuantityMeasurementApp/        ← Spring Boot backend
qm-frontend/                   ← React + Vite frontend
```

---

## ⚙️ Prerequisites

| Tool      | Version     |
|-----------|-------------|
| Java      | 17 or above |
| Maven     | 3.8+        |
| Node.js   | 18 or above |
| npm       | 9+          |

---

## 🚀 Step-by-Step: Run the Project

### Step 1 — Fix pom.xml (one-time)

Open `QuantityMeasurementApp/pom.xml`, find line 19 and change:
```xml
<n>quantity-measurement-app</n>
```
to:
```xml
<name>quantity-measurement-app</name>
```

---

### Step 2 — Start the Backend

```bash
cd QuantityMeasurementApp
mvn spring-boot:run
```

Wait for:
```
Started QuantityMeasurementApplication in X.XXX seconds
```

Backend is now running at → **http://localhost:8080**

---

### Step 3 — Install Frontend Dependencies

Open a **new terminal window**:

```bash
cd qm-frontend
npm install
```

---

### Step 4 — Start the Frontend Dev Server

```bash
npm run dev
```

Open your browser at → **http://localhost:3000**

---

## 🔐 Using the App

### Register / Login (email + password)
1. Open http://localhost:3000
2. Click **Register** tab → enter email + password → click **Create Account**
3. You will be redirected to the app dashboard automatically

### Measurement Operations
1. **Choose Type** — Length, Temperature, Volume, or Weight
2. **Choose Operation** — Convert, Compare, Add, Subtract, Divide
3. **Select units** from the dropdowns
4. **Enter values** in the From / To fields
5. Click the action button → result appears below
6. Click **History** to see past operations

---

## 🌐 Google & GitHub Login (OAuth2)

### Step A — Get Google Credentials
1. Go to https://console.cloud.google.com
2. Create a project → **APIs & Services** → **Credentials**
3. Click **Create Credentials** → **OAuth 2.0 Client ID**
4. Application type: **Web application**
5. Add Authorized redirect URI:
   ```
   http://localhost:8080/login/oauth2/code/google
   ```
6. Copy the **Client ID** and **Client Secret**

### Step B — Get GitHub Credentials
1. Go to https://github.com/settings/developers
2. Click **New OAuth App**
3. Set **Authorization callback URL**:
   ```
   http://localhost:8080/login/oauth2/code/github
   ```
4. Copy the **Client ID** and **Client Secret**

### Step C — Configure application.properties

Open `QuantityMeasurementApp/src/main/resources/application.properties` and replace:

```properties
spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET

spring.security.oauth2.client.registration.github.client-id=YOUR_GITHUB_CLIENT_ID
spring.security.oauth2.client.registration.github.client-secret=YOUR_GITHUB_CLIENT_SECRET
```

Restart the backend. The social login buttons will now work.

---

## 📚 API Reference (Swagger UI)

Visit: **http://localhost:8080/swagger-ui.html**

1. Use **POST /auth/register** to create a user
2. Click **Authorize** (top-right lock icon)
3. Paste the returned token (without `Bearer` prefix)
4. All protected endpoints are now callable

---

## 🗄️ H2 In-Memory Database Console

Visit: **http://localhost:8080/h2-console**

| Field    | Value                              |
|----------|------------------------------------|
| JDBC URL | `jdbc:h2:mem:quantitymeasurementdb` |
| Username | `sa`                               |
| Password | *(leave empty)*                    |

---

## 🔧 Frontend Build (Production)

```bash
cd qm-frontend
npm run build
```

Output goes to `qm-frontend/dist/`. Serve it with any static file server or deploy to Netlify/Vercel.

For production, update the `vite.config.js` proxy target and the OAuth2 redirect URLs to your production domain.

---

## 🛠️ Troubleshooting

| Problem | Fix |
|---------|-----|
| `CORS error` in browser | Make sure backend is running on port 8080 and frontend on port 3000 |
| `401 Unauthorized` | Token expired — log out and log in again |
| Social login not working | Check that OAuth2 credentials are set in `application.properties` |
| `Cannot reach backend` | Run `mvn spring-boot:run` first, then start the React dev server |
| Port 3000 in use | Change `port: 3000` in `vite.config.js` to another port (e.g. 5173) |
