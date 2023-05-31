const fetch = require('node-fetch');

async function SearchAppleMusicForSong(searchQuery) {
    // console.log("Search for: ", searchQuery);
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer BQAfBnvHAK7Y55nx3SqgvQ4pq7xO55rsRraJLg73z4o9SeheWwZaVEXHiaXlOLZhZy4FatUyiok1OOiNrFfwsTOMolXub1HBf5b5MH7QGurrBbhHcXQ"
            }
        });

        const { results } = await response.json();

        if (!results || !results.songs) return searchQuery;

        let { songs, artists } = results;

        songs = songs.data.map(({ attributes }) => {
            const { name, artistName, albumName, artwork, previews } = attributes;
            const preview = previews[0].url;
            const randomName = (Math.random() * 1e32).toString(36);
            const fileName = randomName + "." + preview.split(".").pop();

            return {
                name, artistName, albumName,
                artwork: artwork.url.replace('{w}', 120).replace('{h}', 120),
                preview,
                fileName
            }
        });

        return songs[0];
    } catch (error) {
        console.log("Song fetch error: ", error);
        return searchQuery;
    }
}

module.exports = SearchAppleMusicForSong;