const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const UPLOAD_FOLDER = path.join(__dirname, 'public', 'vid');
const REPORTS_FILE = path.join(__dirname, 'reports.txt');

// Убедитесь, что папка для видео существует
if (!fs.existsSync(UPLOAD_FOLDER)) {
    fs.mkdirSync(UPLOAD_FOLDER);
}

app.use(express.static('public'));
app.use(express.json()); // Для обработки JSON в теле запроса

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Настройка хранения файлов с помощью multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_FOLDER);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Маршрут для загрузки видео
app.post('/upload', upload.single('file'), (req, res) => {
    res.redirect('/');
});

// Маршрут для получения списка видео
app.get('/videos', (req, res) => {
    fs.readdir(UPLOAD_FOLDER, (err, files) => {
        if (err) {
            console.error('Error reading video directory:', err);
            return res.status(500).json({ error: 'Не удалось загрузить видео.' });
        }
        res.json(files);
    });
});

// Маршрут для обработки жалоб
app.post('/report', (req, res) => {
    const { fileName, reason } = req.body;
    const reportEntry = `Video: ${fileName}, Reason: ${reason}\n`;

    fs.appendFile(REPORTS_FILE, reportEntry, (err) => {
        if (err) {
            console.error('Error saving report:', err);
            return res.status(500).json({ error: 'Не удалось сохранить жалобу.' });
        }
        res.json({ message: 'Жалоба успешно отправлена.' });
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
