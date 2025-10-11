const app = require("./index");
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Matching service running on port ${PORT}`);
});
