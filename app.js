require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 9090;
// const homePage = require("./routes/user");
// const authRoute = require("./routes/auth");
// const signRoute = require("./routes/signUp");
const { Sequelize, DataTypes, json } = require("sequelize");

const { engine } = require("express-handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

// app.use("/user", homePage);
// app.use("/auth", authRoute);
// app.use("/signup", signRoute);

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.MYSQLUSERNAME,
  process.env.MYSQLPASSWORD,
  {
    host: "localhost",
    dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
  }
);
async function connection() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    return null;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    return error;
  }
}

const Assignment = sequelize.define(
  "assignment",
  {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    subject: {
      type: DataTypes.STRING,
      // allowNull defaults to true
    },
  },
  {
    // Other model options go here
  }
);
//////////////////////////////////////////
app.get("/home", async (req, res) => {
  try {
    const subject = await Assignment.findAll();

    res.render("user", { data: subject, heading: "Assignments" });
    // res.json({ message: "Success", data: subject });
    // console.log(subject);
  } catch (err) {
    res.json({ message: "Error", data: err });
  }
});
/////////////////////////////////////////
app.get("/Assignment", (req, res) => {
  res.render("post");
});
/////////////////////////////////////////
app.post("/post/Assignment", async (req, res) => {
  try {
    const body = req.body;
    const user = await Assignment.create({
      name: body.name,
      subject: body.subject,
    });
    res.redirect("/home");
  } catch (err) {
    res.json({ message: "Error", data: err });
  }
});
/////////////////////////////////////////
app.get("/api/delete/:id", async (req, res) => {
  try {
    const subject = await Assignment.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.redirect("/home");
  } catch (err) {
    res.json({ message: "Error", data: err });
  }
});
/////////////////////////////////////////
app.get("/update/:id", async (req, res) => {
  try {
    const assign = await Assignment.findOne({
      where: {
        id: req.params.id,
      },
    });

    res.render("update", { data: assign });
    // res.json({ message: "success", data: assign });

    console.log(assign);
  } catch (err) {
    res.json({ message: "Error", data: err });
    console.log(err);
  }
});
///////////////////////////////////////////
app.post("/update/:id", async (req, res) => {
  try {
    const body = req.body;

    const assign = await Assignment.update(
      {
        name: body.name,
        subject: body.subject,
      },

      {
        where: {
          id: req.params.id,
        },
      }
    );

    console.log(assign);

    res.redirect("/home");

    // res.json({message:"success", data:data})
  } catch (err) {
    res.json({ message: "Error", data: err });
  }
});
/////////////////////////////////////////

/////////////////////////////////////////

connection().then((err) => {
  if (!err) {
    app.listen(port, () => {
      console.log("Server Running");
    });
  } else {
    console.log(err);
  }
});
