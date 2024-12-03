const { createApp } = Vue

createApp({
    data() {
        return {
            searchQuery: '',
            movies: [],
            proxyUrl: 'http://localhost:3001',
            isLoading: false,
            error: null,
            searchHistory: JSON.parse(localStorage.getItem('searchHistory') || '[]')
        }
    },
    methods: {
        async searchMovies() {
            if (!this.searchQuery) return
            
            this.isLoading = true
            this.error = null
            this.movies = []

            try {
                const response = await fetch(`${this.proxyUrl}/api/search?query=${encodeURIComponent(this.searchQuery)}`)
                const data = await response.json()
                
                if (data.Search) {
                    this.movies = data.Search
                    this.addToHistory(this.searchQuery)
                } else {
                    this.error = 'No movies found matching your search'
                }
            } catch (error) {
                console.error('Error fetching movies:', error)
                this.error = 'An error occurred while searching. Please try again.'
            } finally {
                this.isLoading = false
            }
        },
        addToHistory(query) {
            if (!this.searchHistory.includes(query)) {
                this.searchHistory.unshift(query)
                if (this.searchHistory.length > 5) {
                    this.searchHistory.pop()
                }
                localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory))
            }
        },
        clearHistory() {
            this.searchHistory = []
            localStorage.removeItem('searchHistory')
        },
        searchFromHistory(query) {
            this.searchQuery = query
            this.searchMovies()
        }
    }
}).mount('#app')