const { createApp } = Vue

createApp({
    data() {
        return {
            searchQuery: '',
            movies: [],
            proxyUrl: 'http://localhost:3001'
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
                    
                    while (data.totalResults > this.movies.length) {
                        const page = Math.floor(this.movies.length / 10) + 1
                        const nextPageResponse = await fetch(`${this.proxyUrl}/api/search?query=${encodeURIComponent(this.searchQuery)}&page=${page}`)
                        const nextPageData = await nextPageResponse.json()
                        this.movies.push(...nextPageData.Search)
                    }
                }
            } catch (error) {
                console.error('Error fetching movies:', error)
            }
        }
    }
}).mount('#app')