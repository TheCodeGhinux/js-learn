import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
// app.use(express.static)

app.get('/hello', (req, res) => {
  res.send('Hello, World!');
});

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something went wrong!');
// });

app.use((req, next) => {
  return res.status(200).json({
    message: "We can't find the resource you're looking for"
  }
)
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});