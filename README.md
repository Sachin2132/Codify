# 🚀 DevStats

> **Track. Analyze. Dominate.**
> A unified dashboard that aggregates your LeetCode, GeeksForGeeks, and CodeChef coding statistics into one beautifully designed, high-performance interface.

---

## 🌟 Overview
**DevStats** is a full-stack web application designed for competitive programmers. It fetches, caches, and visualizes your problem-solving statistics across major coding platforms, presenting them in a premium glassmorphism dark-mode UI with dynamic animations.

### Platforms Supported
- **LeetCode**: Easy / Medium / Hard / Total solved
- **GeeksForGeeks**: Basic / Easy / Medium / Hard / Total solved
- **CodeChef**: Total Solved, Fully / Partially Correct

---

## ✨ Key Features
- **Unified Analytics**: View all your stats in one place with animated counters and progress rings.
- **Rank Badge System**: Dynamically computed ranks based on total problems solved.
- **Difficulty Comparison**: Side-by-side analysis of problem difficulties across platforms.
- **Premium UI/UX**: Aurora backgrounds, floating particle fields, cursor-tracking spotlights, and shimmer loading skeletons.
- **Smart Caching**: 30-minute frontend cache to deliver instant load times and minimize backend scraping overhead.

---

## 🛠 Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS 4
- **Backend**: Java 17, Spring Boot 3.5, Spring Security
- **Scraping Engine**: Node.js, Puppeteer (Headless Chromium), Jsoup

---

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+ and npm
- Maven 3.8+ (or use the provided wrapper)

### 1. Start the Backend
The backend runs Spring Boot and uses a Node.js subprocess (Puppeteer) to scrape platforms that don't provide public APIs.
```bash
cd coding-tracker-backend
npm install                           # Install Puppeteer dependencies
npx puppeteer browsers install chrome # Download headless Chromium
./mvnw spring-boot:run                # Start Spring Boot (Port 8080)
```
*(Use `.\mvnw.cmd spring-boot:run` on Windows)*

### 2. Start the Frontend
```bash
cd coding-tracker-frontend
npm install                           # Install React dependencies
npm run dev                           # Start Vite Server (Port 5173)
```

### 3. Usage
1. Open `http://localhost:5173` in your browser.
2. Enter your usernames for LeetCode, GeeksForGeeks, and CodeChef.
3. Click **Initiate Sync** and watch your stats populate the dashboard!

---

## 📡 API Reference
**Endpoint**: `GET /api/stats`
Fetches combined stats using parallel asynchronous processing. 
It uses LeetCode's public GraphQL API, and Puppeteer headless browser scraping for GeeksForGeeks and CodeChef.

**Query Parameters**:
- `leetcode` (String, Required)
- `gfg` (String, Required)
- `codechef` (String, Required)

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request.

---

## 👨‍💻 Author
Built with ❤️ by **Sachin**.