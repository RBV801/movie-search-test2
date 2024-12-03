import { nlp } from 'https://unpkg.com/compromise'

const { createApp } = Vue

createApp({
    data() {
        return {
            searchQuery: '',
            movies: [],
            proxyUrl: 'http://localhost:3001',
            recognition: null
        }
    },
    mounted() {
        this.recognition = new webkitSpeechRecognition()
        this.recognition.continuous = false
        this.recognition.lang = 'en-US'
        this.recognition.interimResults = false
        this.recognition.maxAlternatives = 1
        
        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript
            this.searchQuery = transcript
            this.searchMovies()
        }
    },
    methods: {
        voiceSearch() {
            this.recognition.start()
        },
        async searchMovies() {
            if (!this.searchQuery) return
            
            const doc = nlp(this.searchQuery)
            
            let genreFilter = ''
            if (doc.has('scary')) genreFilter = '&genre=horror'
            if (doc.has('funny')) genreFilter = '&genre=comedy'
            if (doc.has('action')) genreFilter = '&genre=action'
            
            let keywordFilter = ''
            if (doc.has('alien')) keywordFilter += '&keyword=alien'
            if (doc.has('monster')) keywordFilter += '&keyword=monster'
            if (doc.has('robot')) keywordFilter += '&keyword=robot'
            
            try {
                const response = await fetch(`${this.proxyUrl}/api/search?query=${encodeURIComponent(this.searchQuery)}${genreFilter}${keywordFilter}`)
                const data = await response.json()
                
                if (data.Search) {
                    this.movies = data.Search
                    
                    while (data.totalResults > this.movies.length) {
                        const page = Math.floor(this.movies.length / 10) + 1
                        const nextPageResponse = await fetch(`${this.proxyUrl}/api/search?query=${encodeURIComponent(this.searchQuery)}&page=${page}${genreFilter}${keywordFilter}`)
                        const nextPageData = await nextPageResponse.json()
                        this.movies.push(...nextPageData.Search)
                    }
                    
                    this.movies.sort((a, b) => b.popularity - a.popularity)
                    
                    await this.fetchAdditionalData()
                    
                    this.movies = this.deduplicate(this.movies)
                    this.movies = this.movies.filter(movie => !movie.adult)
                } else {
                    this.movies = []
                }
            } catch (error) {
                console.error('Error fetching movies:', error)
            }
        },
        async fetchAdditionalData() {
            for (const movie of this.movies) {
                const omdbResponse = await fetch(`${this.proxyUrl}/api/details?id=${movie.imdbID}`)
                const omdbData = await omdbResponse.json()
                Object.assign(movie, omdbData)
                
                const rtResponse = await fetch(`${this.proxyUrl}/api/rottentomatoes?id=${movie.imdbID}`)
                const rtData = await rtResponse.json()
                movie.rtScore = rtData.score
                movie.rtUrl = rtData.url
                
                const streamResponse = await fetch(`${this.proxyUrl}/api/streaming?id=${movie.imdbID}`)
                const streamData = await streamResponse.json()
                movie.streamingInfo = streamData
            }
        }, 
        deduplicate(movies) {
            const seen = new Set() 
            return movies.filter(movie => {
                if (seen.has(movie.imdbID)) return false
                seen.add(movie.imdbID)
                return true
            })
        }
    }
}).mount('#app')