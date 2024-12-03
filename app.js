const { createApp } = Vue

createApp({
    data() {
        return {
            searchQuery: '',
            movies: [],
            proxyUrl: 'http://localhost:3000' // Update this to match your proxy server URL
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