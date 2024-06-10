
const { delay } = require("@whiskeysockets/baileys");
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');



// Generate file name for video and audio saving

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function generateRandomFilename() {
    const timestamp = Date.now();
    const randomString = generateRandomString(6);
    return `${timestamp}_${randomString}`;
}



// Youtube Downloading

async function ytvdl(link) {
    if (!ytdl.validateURL(link)) {
        console.log('Invalid YouTube URL:', link);
        return;
    }

    try {
        const info = await ytdl.getInfo(link);
        const title = info.videoDetails.title;
        const filename = generateRandomFilename();
        const filePath = path.resolve(__dirname, '../', 'downloads', `${filename}.mp4`);
        const audioPath = path.resolve(__dirname, '../', 'downloads', `${filename}_audio.mp4`);
        const videoPath = path.resolve(__dirname, '../', 'downloads', `${filename}_video.mp4`);

        // Download video stream
        const videoStream = ytdl(link, { filter: format => format.container === 'mp4' && format.qualityLabel === '360p' })
            .pipe(fs.createWriteStream(videoPath));

        // Download audio stream
        const audioStream = ytdl(link, { filter: 'audioonly' })
            .pipe(fs.createWriteStream(audioPath));

        await Promise.all([
            new Promise((resolve, reject) => videoStream.on('finish', resolve).on('error', reject)),
            new Promise((resolve, reject) => audioStream.on('finish', resolve).on('error', reject))
        ]);

        // Merge video and audio using ffmpeg
        return new Promise((resolve, reject) => {
            ffmpeg()
                .input(videoPath)
                .input(audioPath)
                .outputOptions('-c:v copy')
                .outputOptions('-c:a aac')
                .output(filePath)
                .on('end', async () => {
                    resolve({ filePath, title });
    
                    // Clean up the downloaded files
                    fs.unlink(videoPath, (err) => {
                        if (err) console.error('Error deleting video file:', err);
                    });
                    fs.unlink(audioPath, (err) => {
                        if (err) console.error('Error deleting audio file:', err);
                    });
                })
                .on('error', (err) => {
                    console.error('Error merging video and audio:', err);
                    reject(err);
                })
                .run();
        });
}catch(error){
    console.log('Error downloading video:', error);
    throw error;
}}

// Youtube Audio Only

async function ytadl(link) {
    if (!ytdl.validateURL(link)) {
        console.log('Invalid YouTube URL:', link);
        return;
    }

    try {
        const info = await ytdl.getInfo(link);
        const title = info.videoDetails.title;
        const filename = generateRandomFilename();
        const filePath = path.resolve(__dirname, '../', 'downloads', `${filename}.mp3`);

        return new Promise((resolve, reject) => {
            // Download audio stream
            ytdl(link, { filter: 'audioonly', format: 'mp3' })
                .pipe(fs.createWriteStream(filePath))
                .on('finish', () => {
                    resolve({ filePath, title });
                })
                .on('error', (error) => {
                    console.error('Error downloading audio:', error);
                    reject(error);
                });
        });
    } catch (error) {
        console.error('Error downloading audio:', error);
        throw error;
    }
}

module.exports = {ytvdl , ytadl};
