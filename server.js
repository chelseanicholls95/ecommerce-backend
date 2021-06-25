const express = require("express");

const sequelize = require("./config/connection");
const routes = require("./routes");
sequelize;

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

const init = async () => {
  try {
    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}!`);
    });
  } catch (error) {
    console.log(`Connection to DB failed: ${error.message}`);
  }
};

init();
