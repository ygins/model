const Model = require("../model");

describe("Models having other requirements", () => {
  describe("Requirement saying that obj.name must be equal to \"John\"", () => {
    const requirement = (obj) => obj.name == "John";
    const model = new Model({
      name: String
    });
    model.alsoRequire(requirement);
    test("Object with name David should not pass", () => {
      expect(model.check({
        name: "David"
      })).toBe(false);
    });
    test("Object with name John should pass", () => {
      expect(model.check({
        name: "John"
      })).toBe(true);
    });
  });
});
