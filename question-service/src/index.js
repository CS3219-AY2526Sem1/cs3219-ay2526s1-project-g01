import app from './app.js'; 

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`[INFO] Question service listening at http://localhost:${PORT}`);
  console.log(`[INFO] Connecting to:`, process.env.DB_HOST);
});
