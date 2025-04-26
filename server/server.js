const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { spawn } = require('child_process');  //do odpalania skryptu python



const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
app.options('/api/*', cors(corsOptions));
app.use(express.json());

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
app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});

app.post('/analyze', (req, res) => {
    const { image } = req.body;
    console.log('Dostałem obrazek base64:', image.substring(0, 100)); // wypisujemy tylko kawałek, żeby nie było za długie
    res.json({ message: 'Obrazek odebrany!' });
}); 

app.post('/run-python', (req, res) => {

    const venvPath = path.join(__dirname, '..', 'python', 'venv', 'bin', 'activate');  
    const scriptPath = path.join(__dirname, '..', 'python', '1.py');

    // Aktywacja wirtualnego środowiska i uruchomienie skryptu
    const python = spawn('bash', ['-c', `source ${venvPath} && python ${scriptPath}`]);

    let result = '';
    let error = '';

    python.stdout.on('data', (data) => {
        result += data.toString();
    });
    python.stderr.on('data', (data) => {
        error += data.toString();
    });

    python.on('close', (code) => {
        if (code !== 0) {
            console.error(`Skrypt zakończył się błędem: ${error}`);
            res.status(500).json({ error: 'Wystąpił błąd podczas uruchamiania skryptu.' });
        } else {
            console.log(`Wynik skryptu: ${result}`);
            res.json({ output: result.trim() });
        }
    });




})