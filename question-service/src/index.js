import app from './app.js'; // <-- ES module import

const PORT = process.env.PORT || 7001;

app.listen(PORT, () => {
  console.log(`Question service listening at http://localhost:${PORT}`);
});
