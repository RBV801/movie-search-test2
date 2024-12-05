export async function searchMovies(query) {
  const response = await fetch(`http://localhost:3001/api/search?query=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }
  const data = await response.json();
  return data;
}