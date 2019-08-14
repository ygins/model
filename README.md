# runtime-models
runtime-models is a NPM package, inspired by mongoose schemas,
to create models at runtime with JS.

You can think of a model as a class. The difference being that classes **create**
objects whereas models **check** objects to see if they are in conformity.
This can be useful when you are validating an objects structure that wasn't made
from a specific class, such as accepting POST requests.

## Installation
NPM:
`npm install runtime-models`

## Usage

### Creating a model
Models are made by creating an object with key-value pairs. These pairs
reflect the key required and the type that the key must be
```javascript
const Model=require("runtime-models");
let bookModel=new Model({
  author: String,
  title: String,
  year: Number
})
```
Models can have multiple layers of depth, just like any javascript object
```javascript
const Model=require("runtime-models");
let bookModel=new Model({
  author: String,
  title: String,
  year: Number
  cover: { //multiple layers
    artist: String
  }
});
```
To declare array types, you simply put the type ALONE inside an array:
```javascript
const Model=require("runtime-models");
let bookModel=new Model({
  author: {
    name: String,
    otherBooks: [String] //otherbooks is now a String array
  },
  title: String,
  year: Number
  cover: {
    artist: String
  }
});
```
You can also use the objects of models as types, for example:
```javascript
const Model=require("runtime-models");
const pageObj={
  number: Number,
  chapter: Number,
  text: String
}
let pageModel=new Model(pageObj);

let bookModel=new Model({
  author: {
    name: String,
    otherBooks: [String]
  },
  title: String,
  year: Number
  cover: {
    artist: String
  },
  pages: [pageObj] //pages now requires us to have an array of pages
});
```

### Checking an object against a model
Checking objects is extremely simple-take the following code:
```javascript
const Model=require("runtime-models");
let myModel=new Model({
  data: {
    word: String,
    num: Number
  }
});

let objOne={
  data:{
    word: "I am a word!",
    num: 5
  }
}

let objTwo={
  data:{

  }
}

let objThree={
  word: "I am also a word!",
  num: 4
}

myModel.check(objOne) //returns true
myModel.check(objTwo)//returns false
myModel.check(objThree) //returns false
```

### The required option
You can make a field in the model optional. To do so is simple.
Say we had this model
```javascript
let model=new Model({
  num: Number,
  str: String
});
```
So, let's leave "num" as required, but make "str" optional.
```javascript
let model=new Model({
  num: Number,
  str: {
    type: String,
    required: false
  }
})
```
Now, an object such as the following one passes our model check.
```javascript
let myObj={num: 5};
```

### Additional checks
In some cases, type checks wont be enough. To add more checks is simple.
Let's say we had this model:
```javascript
let model=new Model({
  id: String,
  num: 5
});
```
Let's say we want id to not only be a String, but a SPECIFIC String. To add that
is simple. the `model.alsoRequire` function takes a function that, when passed
the object being checked, returns true or false based on some criteria. For example:
```javascript
let model=new Model({
  id: String,
  num: Number
});
model.alsoRequire(obj=>obj.id=="Some ID");

let objOne={
  id: "Some ID",
  num: 4
};
let objTwo={
  id: "Some other ID",
  num: 3
};
model.check(objOne) //true
model.check(objTwo)// false
```

And that's it! Enjoy!
