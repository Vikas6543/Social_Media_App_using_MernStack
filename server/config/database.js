const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log('Database Connected');
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDatabase;
