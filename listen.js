const app = require('./app');
const port = 9090;

app.listen(9090, () => {
  console.log(`Server is listening on port ${port}`);
});