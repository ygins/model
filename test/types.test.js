const Model=require("../index");


describe("Check for type equality in models", ()=>{

    let createModel=(type)=>new Model({obj:type});
    let createObj=(val)=>{return {obj:val};};

    describe.each(
    [  [String, "Hey", 5],
      [Number,4, "Hey!"],
      [Boolean, true, "sdsd"],
      [Boolean, false, 34],
      [BigInt, BigInt(45454545), "Hey there"],
      [Symbol, Symbol("Muahahaah"), []]])(
      `Type check %p for %p and against %p`,
      (type, val, untrue)=>{
        let valStr=typeof(val)=="symbol" ? "symbol":val;
        test(`Model of type ${type} should check with object of val ${valStr} but not ${untrue}`, ()=>{
          let model=createModel(type);
          expect(model.check(createObj(val))).toBe(true);
          expect(model.check(createObj(untrue))).toBe(false);
        });
      }
    );

    describe.each(
      [
        [[String], ["Hey!"], [5]],
        [[[String]], [["Hey!"]], [5]],
        [[Boolean], [true], [5]],
        [[Boolean], [false], [5]],
        [[[Boolean]], [[false]],[true]]
      ])(
      `Array type check %p for %p and against %p`,
      (type, val, untrue)=>{
        let model=createModel(type);
        test(`model should evaluate to true with ${val}`, ()=>{
          expect(model.check(createObj(val))).toBe(true);
        });
        test(`model should evaluate to false with ${untrue}`, ()=>{
            expect(model.check(createObj(untrue))).toBe(false);
        });
      }
    );

  describe("Object types", ()=>{
    let makeModelOne;
    let makeOne, makeTwo, makeThree;
      makeOne=(val)=>{return {
        data:{
          secret:{
            val: val
          }
        }
      };};
      makeTwo=(val)=>{return {val: val};};
      makeThree=(val)=>{return {
        data:{
          secret:{
            one:{
              two:{
                three:{
                  val: val
                }
              }
            }
          }
        }
      };};
    makeModelOne=function(type){return new Model(makeOne(type));};

    describe.each(
      [[makeModelOne(String), makeOne("Hey!")],
        [makeModelOne(Number),makeOne(5)]])(
        `Test model %p for obj %p`,
        (model, obj)=>{
          test(`The model ${model} should match the object ${obj}`, ()=>{
            expect(model.check(obj)).toBe(true);
          });
        }
    );
  describe.each(
    [[makeModelOne(String), makeTwo("Hey!")],
      [makeModelOne(Number),makeTwo(5)]])(
      `Less depth test: model %p against %p`,
      (model, obj)=>{
        test(`Model ${model} should not check ${obj} becuase obj has less depth`, ()=>{
            expect(model.check(obj)).toBe(false);
        });
      }
  );
  describe.each(
    [[makeModelOne(String), makeThree("Hey!")],
      [makeModelOne(Number),makeThree(5)]])(
      `More depth test: model %p against %p`,
      (model, obj)=>{
        test(`Model ${model} should not check ${obj} becuase obj has more depth`, ()=>{
            expect(model.check(obj)).toBe(false);
        });
      }
  );
});

});
