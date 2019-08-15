const doesntExist = (obj) => obj === undefined || obj === null;
const exists = (obj) => !doesntExist(obj);
const isObjectOrArray = (obj) => exists(obj) && typeof(obj) === "object";
const isReallyObject = (obj) => isObjectOrArray(obj) && !Array.isArray(obj);

const objectIsModelRemake = (object, model) => {
  for (let [modelKey, modelVal] of Object.entries(model)) {
    let objVal = object[modelKey];
    //Grab type of what objVal should be
    let type;
    let required = true;
    if (isReallyObject(modelVal)) {
      if (exists(modelVal.type)) {
        //The model is NOT declaring an inner object-this is a type declaration
        type = modelVal.type;
        required = exists(modelVal.required) ? modelVal.required : false;
      } else {
        //The object is a further declaration
        if (!isReallyObject(objVal) || !objectIsModelRemake(objVal, modelVal)) { //if the provided value isnt an object, fail.

          return false;
        } else {
          continue;
        }
      }
    } else {
      type = modelVal;
    }
    //Maybe the object isnt required.
    if (doesntExist(objVal)) {
      if (required) {
        return false;
      } else {
        continue;
      }
    }
    //Now lets process types. Two options here: Array or primitive. We've handled plain objects
    if (Array.isArray(type)) {
      if (!Array.isArray(objVal)) {
        return false;
      }
      //We either have an object array or primitive array. This function depends
      //on that.
      let checkerFunc;
      if (isObjectOrArray(type[0])) { //object array
        checkerFunc = (val, myType) => val.every(item => objectIsModelRemake(item, myType));
      } else { //Primitive array
        checkerFunc = (val, myType) => val.every(item => myType.prototype.isPrototypeOf(Object(item)));
      }
      if (!checkerFunc(objVal, type[0])) {
        return false; //Array didn't pass
      }
    } else {
      //Primitive value
      if (!type.prototype.isPrototypeOf(Object(objVal))) {
        return false;
      }
    }
  }
  return true;
};
class Model {
  constructor(obj) {
    this._modelObj = obj;
    this._alsoRequires = [];
  }

  alsoRequire(func) {
    this._alsoRequires.push(func);
  }

  check(obj) {
    if (!objectIsModelRemake(obj, this._modelObj)) {
      return false;
    }
    return this._alsoRequires.every(func => func(obj));
  }
  checkStrict(obj) {
    if (!this.check(obj)) {
      return false;
    }

    function checkKeys(object, model) {
      for (let [key, val] of Object.entries(object)) {
        let typeExists = exists(model.type);
        let objType = typeExists ? model.type : model[key];
        if (doesntExist(objType)) {
          return false;
        }
        if (isObjectOrArray(val) && !typeExists) {
          if (!checkKeys(val, objType)) {
            return false;
          } else continue;
        }
      }
      return true;
    }
    return checkKeys(obj, this._modelObj);
  }
}
module.exports = Model;
