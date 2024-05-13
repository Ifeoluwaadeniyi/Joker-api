const express = require("express");

const PORT = 5173;
const app = express();

let db = [];

app.use(express.json());

app.all("/", (req, res) => {
  return res.json({ success: true, message: "Welcome to the Jokes API" });
});

app.get("/jokes", (req, res) => {
  return res.json({ success: true, jokes: db });
});

app.post("/jokes", (req, res) => {
  console.log(req.body);
  const { joke } = req.body;

  if (!joke) {
    return res.status(400).json({
      success: false,
      message: 'Error joke is required, sample { joke: "string" }',
    });
  }

  db.push({ id: db.length + 1, joke });

  return res.json({ success: true, jokes: db });
});

app.get("/jokes/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Error ID is required",
    });
  }

  const joke = db.find((item) => item.id === Number(id));

  if (!joke) {
    return res.status(404).json({
      success: false,
      message: "Joke not found",
    });
  }

  return res.json({
    success: true,
    data: joke,
  });
});

app.delete("/jokes/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Error ID is required",
    });
  }

  const joke = db.find((item) => item.id === Number(id));

  if (!joke) {
    return res.status(404).json({
      success: false,
      message: "Joke not found",
    });
  }

  db = db.filter((item) => item.id !== Number(id));

  return res.json({
    success: true,
    message: "Successfully deleted joke",
    data: joke,
  });
});

app.patch("/jokes/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Error ID is required",
    });
  }

  if (!req.body.joke) {
    return res.status(400).json({
      success: false,
      message: 'Error joke is required, sample { joke: "string" }',
    });
  }

  const joke = db.find((item) => item.id === Number(id));

  if (!joke) {
    return res.status(404).json({
      success: false,
      message: "Joke not found",
    });
  }

  db = db.map((item) => {
    if (item.id === Number(id)) {
      return { ...item, joke: req.body.joke };
    }

    return item;
  });

  return res.json({
    success: true,
    message: "Successfully updated joke",
    data: { id, joke: req.body.joke },
  });
});

app.listen(PORT, () => {
  console.log("listening on " + PORT);
});
