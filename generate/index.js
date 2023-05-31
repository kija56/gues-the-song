const https = require('https'); // or 'httpss' for httpss:// URLs
const fs = require('fs');
const SearchAppleMusicForSong = require('./searchAppleMusicForSong');

function shuffle(array) {
  return [...array].sort(_ => Math.random() - 0.5);
}

// const songList = fs.readFileSync(__dirname + "/../songlist-the-voice.txt", 'utf8');
const songList = fs.readFileSync(__dirname + "/../songlist.txt", 'utf8');
const songArray = songList.split('\n');

Promise.all(
  songArray.map(async (songName) => {
    const song = await SearchAppleMusicForSong(songName);
    return song;
  })
)
.then(songs => {
  const failedSongs = songs.filter(song => !song || typeof song != "object");
  const validSongs = songs.filter(song => song && typeof song == "object");
  fs.writeFileSync('songs.json', JSON.stringify(shuffle(validSongs)), 'utf8');
  console.log(`\n\n\n${validSongs.length} songs created`);
  console.log("\n\n\nFailed Songs: ", failedSongs);

  downloadSongs(validSongs);
})
.catch(err => console.log("\n\n\nFailed to create songs: ", err))


async function downloadSongs(songs){
  await Promise.all(songs.map(downloadFile));
  console.log("\n\n\n Songs previews downloaded");
}

function downloadFile(song){
  return new Promise((res, rej) => {
    console.log("\n\nDownload file for: ", song.name);
    const dirPath = __dirname + "/../songs/";
    !fs.existsSync(dirPath) && fs.mkdirSync(dirPath, { recursive: true });
    const file = fs.createWriteStream(dirPath + song.fileName);
    const request = https.get(song.preview, function(response) {
      response.pipe(file);
      res(file);
    });
  });
}