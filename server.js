import e from "express";

const app = e();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, SafeChat API!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});