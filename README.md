# Movie Search Application

## POC Setup Instructions

1. Clone proxy server:
```bash
git clone https://github.com/RBV801/proxy-server2.git
cd proxy-server2
npm install
```

2. Configure proxy server:
```bash
cp .env.example .env
# Edit .env and add your OMDB API key
```

3. Start proxy server:
```bash
npm start
```

4. In a new terminal, clone frontend:
```bash
git clone -b POC https://github.com/RBV801/movie-search-test2.git
cd movie-search-test2
```

5. Open `index.html` in your browser

## Features
- Movie search using OMDB API
- Secure API handling through proxy server
- Responsive design