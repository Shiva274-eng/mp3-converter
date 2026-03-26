const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const Conversion = require('../models/Conversion');

// Multer Config
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        const { format, userId } = req.body;
        
        const inputPath = req.file.path;
        const outputFileName = `converted_${Date.now()}.${format}`;
        const outputPath = path.join(__dirname, '../uploads', outputFileName);

        ffmpeg(inputPath)
            .toFormat(format)
            .on('end', async () => {
                const fileUrl = `/uploads/${outputFileName}`;
                if(userId) {
                    await Conversion.create({
                        userId,
                        originalFileName: req.file.originalname,
                        format,
                        fileUrl,
                        status: 'completed'
                    });
                }
                res.json({ message: 'Conversion successful', fileUrl });
            })
            .on('error', (err) => {
                console.error(err);
                res.status(500).json({ message: 'Conversion failed', error: err.message });
            })
            .save(outputPath);
            
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/link', async (req, res) => {
    try {
        const { url, format, userId } = req.body;
        if (!url) return res.status(400).json({ message: 'No URL provided' });
        
        const outputFileName = `converted_link_${Date.now()}.${format}`;
        const outputPath = path.join(__dirname, '../uploads', outputFileName);

        const youtubedl = require('yt-dlp-exec');
        const options = {
            noCheckCertificates: true,
            noWarnings: true,
            noPlaylist: true,
            addHeader: [
                'referer:youtube.com',
                'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            ]
        };

        if (format === 'mp3' || format === 'wav') {
            options.format = 'bestaudio';
            options.extractAudio = true;
            options.audioFormat = format;
            options.output = outputPath;
        } else {
            options.format = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best';
            options.mergeOutputFormat = format;
            options.output = outputPath;
        }

        await youtubedl(url, options);

        const fileUrl = `/uploads/${outputFileName}`;
        if(userId) {
            await Conversion.create({
                userId,
                originalFileName: url,
                format,
                fileUrl,
                status: 'completed'
            });
        }
        res.json({ message: 'Conversion successful', fileUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Link conversion failed', error: error.message });
    }
});

router.get('/history/:userId', async (req, res) => {
    try {
        const history = await Conversion.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
