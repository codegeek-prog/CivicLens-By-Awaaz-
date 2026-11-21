# CivicLens

> powered by Awaaz

CivicLens is a civic complaint web application designed for city residents, optimized for mobile devices and accessible to people across Indian regional languages (English, हिन्दी, తెలుగు, தமிழ், বাংলা, मराठी).

## Routing Table

Every complaint ticket is assigned to a responsible civic municipal department:

| Issue Category | Assigned Department |
| :--- | :--- |
| **Roads** | **Roads & Buildings** |
| **Waste** | **Sanitation** |
| **Water** | **Water Board** |
| **Electricity** | **Electricity Department** |
| **Trees** | **Parks & Gardens** |
| **Drainage** | **Drainage Department** |

## Gemini Severity Rules

1. **Critical**: Live wires, gas leaks, open manholes, flooding, or danger to children or crowds.
2. **High**: Blocked roads or no water supply for days.
3. **Medium**: Ordinary damage (standard potholes, uncollected waste, dark street).
4. **Low**: Cosmetic issues (minor litter, faded markings).
5. **Vague Complaints**: Chooses the best category and highlights what clarification is needed.

## Running the Application

### 1. (Optional) Set your Gemini API Key
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8000
```

### 2. Start the Server
```bash
python server.py
```
Visit `http://localhost:8000`.
