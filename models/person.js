const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("connected to MongoDB"))
  .catch((error) => console.log("error connecting to MongoDB", error.message));

const phonebookSchema = mongoose.Schema({
  name: { type: String, required: true, minLength: 3, unique: true },
  number: { type: String, required: true, minLength: 8, unique: true },
});

phonebookSchema.plugin(uniqueValidator);

phonebookSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

const Person = mongoose.model("Person", phonebookSchema);

module.exports = Person;
