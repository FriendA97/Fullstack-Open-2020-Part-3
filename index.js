const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(express.static("build"));
morgan.token("postBody", (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  } else {
    return;
  }
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :postBody"
  )
);
app.use(cors());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Phonebook</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const today = new Date();
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
  <p>${today.toString()}</p>
  `);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons
    .filter((person) => person.id !== id)
    .map((person) => {
      if (person.id > id) {
        return { ...person, id: person.id - 1 };
      } else {
        return person;
      }
    });
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name) {
    return res.status(400).json({ error: "Name missing" });
  } else if (!body.number) {
    return res.status(400).json({ error: "Number missing" });
  } else if (persons.find((person) => person.name === body.name)) {
    return res.status(400).json({ error: "Name is already exists" });
  }
  const person = {
    id: Math.floor(Math.random() * (1000 - 5) + 5),
    name: body.name,
    number: body.number || "",
  };
  persons = persons.concat(person);
  res.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
