const { createApp } = Vue

createApp({
    data() {
        return {
            searchQuery: '',
            movies: [],
            apiKey: 'your_omdb_api_key' // To be replaced with proxy server call
        }
    },
    methods: {
        async searchMovies() {
            if (!this.searchQuery) return
            
            try {
                // This will be updated to use proxy server
                const response = await fetch(`http://www.omdbapi.com/?s=${this.searchQuery}&apikey=${this.apiKey}`)
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