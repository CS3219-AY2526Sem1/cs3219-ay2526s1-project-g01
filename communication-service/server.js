const express = require('express');
const cors = require('cors');
const connectionRoutes = require('./routes/connection-routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/connection', connectionRoutes);

app.listen(PORT, () => {
  console.log(`Communication service running on port ${PORT}`);
});


