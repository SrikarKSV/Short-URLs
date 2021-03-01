const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: 'config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('✅✅ Connected to DATABASE'))
  .catch((err) =>
    console.log('💥💥 There was an error connecting to DATABASE', err)
  );

const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`Server started on http://localhost:${PORT}`));
