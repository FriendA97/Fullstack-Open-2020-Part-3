require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

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

app.get("/", (req, res) => {
  res.send("<h1>Phonebook</h1>");
});

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((error) => next(error));
});

app.get("/info", (req, res, next) => {
  const today = new Date();
  Person.find({})
    .then((persons) =>
      res.send(`<p>Phonebook has info for ${persons.length} people</p>
  <p>${today.toString()}</p>
  `)
    )
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then((result) => {
      console.log(result);
      res.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;
  if (body.name === undefined) {
    return response.status(400).json({ error: "content missing" });
  }
  const addedPerson = new Person({
    name: body.name,
    number: body.number || "",
  });
  addedPerson
    .save()
    .then((savedPerson) => res.json(savedPerson))
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;

  const updatedPerson = { name: body.name, number: body.number };

  Person.findByIdAndUpdate(req.params.id, updatedPerson, {
    new: true,
    runValidators: true,
  })
    .then((editedPerson) => res.json(editedPerson))
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
