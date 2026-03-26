const youtubedl = require('yt-dlp-exec');
const path = require('path');

const url = 'https://www.youtube.com/watch?v=BaW_jenozKc'; // safe youtube video
const outputPath = path.join(__dirname, 'test.mp3');

console.log('Testing yt-dlp-exec...');

const options = {
    noCheckCertificates: true,
    noWarnings: true,
    noPlaylist: true,
    format: 'bestaudio',
    extractAudio: true,
    audioFormat: 'mp3',
    output: outputPath
};

youtubedl(url, options)
    .then(output => console.log('Successfully downloaded', output))
    .catch(err => console.error('Error:', err.message));
