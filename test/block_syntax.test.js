const Model = require("../index");

describe("Block syntax vs single-value syntax", () => {
  let valueModel = new Model({
    val: String
  });
  let blockModel = new Model({
    val: {
      type: String
    }
  });
  test("Both models should check a simple string object", () => {
    let objectToMatch = {
      val: "Hey!"
    };
    expect(blockModel.check(objectToMatch)).toBe(true);
    expect(valueModel.check(objectToMatch)).toBe(true);
  });
  test("Both models should not check a simple number object", () => {
    let objectToNotMatch = {
      val: 5
    };
    expect(blockModel.check(objectToNotMatch)).toBe(false);
    expect(valueModel.check(objectToNotMatch)).toBe(false);
  });
});

describe("The required parameter", () => {
  let requiredModel = new Model({
    name: String,
    number: {
      type: Number,
      required: false
    }
  });
  test("An object with the required parameter should pass", () => {
    expect(requiredModel.check({
      name: "Me",
      number: 5
    })).toBe(true);
  });
  test("An object without the required parameter should also pass", () => {
    expect(requiredModel.check({
      name: "Me!"
    })).toBe(true);
  });

  describe("Boolean as the not required parameter", () => {
    let boolModel = new Model({
      name: String,
      test: {
        type: Boolean,
        required: false
      }
    });
    test("An object with the parameter set to true should pass", () => {
      expect(boolModel.check({
        name: "Me!",
        test: true
      })).toBe(true);
    });
    test("An object with the parameter set to false should pass", () => {
      expect(boolModel.check({
        name: "Me!",
        test: false
      })).toBe(true);
    });
    test("An object without the parameter at all should also pass", () => {
      expect(boolModel.check({
        name: "Me!"
      })).toBe(true);
    });
  });
});

describe("The underscore option", () => {
  describe.each(
    [
      [true, true, true],
      [true, false, false],
      [false, true, false],
      [false, false, true]
    ]
  )(`underscore option=%p. actually underscored type=%p. Expected output when given {name: "Hey"}=%p`, (underscoreOption, actualUnderscore, output) => {
    let typeField = actualUnderscore ? "_type" : "type";
    let obj = {
      name: {}
    };
    obj.name[typeField] = String;
    console.log(obj);
    let model = new Model(obj, underscoreOption);
    test("Test _type with model.match", () => {
      expect(model.check({
        name: 'Hey'
      })).toBe(output);
    });
  });

  describe("Test _required", ()=>{
    let model=new Model(true, {id: Number, name: {_type: String, _required: false}});
    describe("Model takes underscores and required false", ()=>{
      test("pass object without field for model", ()=>{
          expect(model.check({id: 4})).toBe(true);
      });
      test("pass object with field for model", ()=>{
        expect(model.check({id: 5, name: "Hey!"})).toBe(true);
      });
    });
  });
  test("If underscore option, can use test and required as fields", ()=>{
    const model=new Model(true,{
      name:{
        _type: String,
        _required: true
      },
      type: Number
    });
    expect(model.check({name: "Hey!", type:5})).toBe(true);
  });
});
