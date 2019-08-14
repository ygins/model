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
