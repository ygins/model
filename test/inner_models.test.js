const Model = require("../index");
describe("Models within models", () => {
  describe("Given a model of id: String and data: [dataObj], where dataObj is of data: Number", () => {
    let dataObj = {
      data: Number
    };
    let model = new Model({
      id: String,
      data: [dataObj]
    });
    test("An object without the data field should fall", () => {
      expect(model.check({
        id: "hey"
      })).toBe(false);
    });
    test("An object with one data field should fail", () => {
      expect(model.check({
        id: 'Hey',
        data: {
          data: 4
        }
      })).toBe(false);
    });
    test("An object with one data field in an array should pass", () => {
      expect(model.check({
        id: "Hey",
        data: [{
          data: 4
        }]
      })).toBe(true);
    });
    test("An object with three data fields in an array should pass", () => {
      expect(model.check({
        id: "Hey",
        data: [{
          data: 4
        }, {
          data: 6
        }, {
          data: 9
        }]
      })).toBe(true);
    });
    test("An object with three data fields in an array but one invalid should fail", () => {
      expect(model.check({
        id: "Hey",
        data: [{
          data: 4
        }, {
          data: 6
        }, {
          data: "sike"
        }]
      })).toBe(false);
    });
  });
});
