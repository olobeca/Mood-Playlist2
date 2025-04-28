const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { spawn } = require('child_process');  //do odpalania skryptu python
const fs = require('fs');
const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

const privateKey = fs.readFileSync('private_key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
  });

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
app.options('/api/*', cors(corsOptions));
app.use(express.json({ limit: '100mb' }));

const logger = (req,res, next) => {
    const czas = new Date().toISOString();
    console.log(`${req.method} ${req.url} ${czas}`);
    next();
};

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy",
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' blob:; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: blob:;"
    );
    next();
  });

app.use(logger);

// Start serwera
const PORT = 5001;
//serwer https
const https = require('https');
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(PORT, () => {
  console.log(`Serwer HTTPS działa na https://localhost:${PORT}`);
});

app.post('/analyze', (req, res) => {
    const { image } = req.body;
    console.log('Dostałem obrazek base64:', image.substring(0, 100)); // wypisujemy tylko kawałek, żeby nie było za długie
    res.json({ message: 'Obrazek odebrany!' });
}); 


app.post('/run-python', (req, res) => {
    let { image } = req.body;

    // Splitowanie obrazka, żeby pasował
    if (image.startsWith('data:image')) {
        image = image.split(',')[1];
    }
    console.log('Otrzymany obrazek - debug in server:', image.substring(0, 100)); // debug

    const venvPath = path.join(__dirname, '..', 'python', 'venv', 'bin', 'activate');  
    const scriptPath = path.join(__dirname, '..', 'python', '1.py');

    // Aktywacja wirtualnego środowiska i uruchomienie skryptu
    const python = spawn('bash', ['-c', `source ${venvPath} && python ${scriptPath} '${image}'`]);
    let result = '';
    let error = '';

    python.stdout.on('data', (data) => {
        result += data.toString();
    });
    python.stderr.on('data', (data) => {
        error += data.toString();
    });

    python.on('close', (code) => {
        console.log(`Proces zakończony z kodem: ${code}`);
        if (code !== 0) {
            console.error(`Skrypt zakończył się błędem: ${error}`);
            res.status(500).json({ error: 'Wystąpił błąd podczas uruchamiania skryptu.' });
        } else {
            console.log(`Wynik skryptu: ${result}`);

            // Uzyskanie tokenu dostępu (Client Credentials Flow)
            const emotion = JSON.parse(result).emotion;
            const age = JSON.parse(result).age;
            const race = JSON.parse(result).race;
            spotifyApi.clientCredentialsGrant()
                .then((data) => {
                    console.log('Uzyskano token dostępu:', data.body['access_token']);
                    spotifyApi.setAccessToken(data.body['access_token']);
                    const agePhrase = age < 18 ? 'for teenagers' : `for ${age} year olds`;
                    return spotifyApi.searchPlaylists(`${emotion} playlist ${agePhrase}`);
                })
                .then((data) => {
                    console.log('Znalezione playlisty:', data.body);
                    const playlists = data.body.playlists.items
                        .filter((playlist) => playlist !== null) 
                        .map((playlist) => ({
                            name: playlist.name,
                            url: playlist.external_urls.spotify,
                            tracks: playlist.tracks.total,
                        }));

                    // Wysyłamy wynik skryptu Pythona i playlisty jako odpowiedź
                    res.json({
                        pythonOutput: result.trim(),
                        playlists: playlists || [], //pusta jesli puste
                    });
                })
                .catch((error) => {
                    console.error('Błąd podczas wyszukiwania playlist:', error);
                    res.status(500).json({ error: 'Wystąpił błąd podczas wyszukiwania playlist.' });
                });
        }
    });
});     
