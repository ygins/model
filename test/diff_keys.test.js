const Model = require("../index");

describe("Objects being checked missing keys/have too many", () => {
  let model = new Model({
    name: [[String]],
    id: Number
  });
  test("Object missing id field in model with name & id should fail", () => {
    expect(model.check({
      name: [["No ID"]]
    })).toBe(false);
  });
  describe("checkStrict vs check", () => {
    let obj = {
      name: [["Hey"]],
      id: 1234
    };
    describe.each([
      ["Hey"],
      [5],
      [[3,4,5]],
      [[[false]]]
    ])(`Object with extra field %p`, (field)=>{
      obj.random=field;
      test("Should pass check", ()=>{
        expect(model.check(obj)).toBe(true);
      });
      test("should fail checkStrict", () => {
        expect(model.checkStrict(obj)).toBe(false);
      });
    });

  });
});
