const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.FASTSAVER_KEY;
const BASE_URL = 'https://api.fastsaver.io/v1/fetch';

app.post('/api/descargar', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ ok: false, error: 'Falta el link' });

  try {
    const respuesta = await fetch(`${BASE_URL}?url=${encodeURIComponent(url)}`, {
      headers: { 'X-Api-Key': API_KEY }
    });

    const datos = await respuesta.json();

    if (datos.ok) {
      res.json({
        ok: true,
        download_url: datos.download_url,
        music_url: datos.music_url,
        type: datos.type
      });
    } else {
      res.status(400).json({ ok: false, error: datos.detail || 'No se pudo resolver' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: 'Error de conexión' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor listo en puerto ${PORT}`));
