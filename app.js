import { nlp } from 'https://unpkg.com/compromise'

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
                }
            } catch (error) {
                console.error('Error fetching movies:', error)
            }
        }
    }
}).mount('#app')