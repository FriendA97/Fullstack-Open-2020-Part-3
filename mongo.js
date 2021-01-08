const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password> "
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://Phonebook:${password}@cluster0.pp4ur.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const phonebookSchema = mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", phonebookSchema);

const person = new Person({
  name: "An Nguyen",
  number: "0123-432514",
});

person.save().then((res) => {
  console.log("contact saved");
  Person.find({}).then((persons) => {
    persons.forEach((person) => console.log(person));
    mongoose.connection.close();
  });
});
