const { createApp } = Vue

createApp({
    data() {
        return {
            searchQuery: '',
            movies: [],
            proxyUrl: 'http://localhost:3001' // Updated port to 3001
        }
    },
    methods: {
        async searchMovies() {
            if (!this.searchQuery) return
            
            try {
                const response = await fetch(`${this.proxyUrl}/api/search?query=${encodeURIComponent(this.searchQuery)}`)
                const data = await response.json()
                
                if (data.Search) {
                    this.movies = data.Search
                }
            } catch (error) {
                console.error('Error fetching movies:', error)
            }
        }
    }
}).mount('#app')