const doesntExist = (obj) => obj === undefined || obj === null;
const exists = (obj) => !doesntExist(obj);
const isObjectOrArray = (obj) => exists(obj) && typeof(obj) === "object";
const isReallyObject = (obj) => isObjectOrArray(obj) && !Array.isArray(obj);
const objectIsModelRemake = (object, model, underscoreOptions) => {
  const typeField=underscoreOptions ? "_type":"type";
  const requiredField=underscoreOptions ? "_required":"required";
  for (let [modelKey, modelVal] of Object.entries(model)) {
    let objVal = object[modelKey];
    //Grab type of what objVal should be
    let type;
    let required = true;
    if (isReallyObject(modelVal)) {
      if (exists(modelVal[typeField])) {
        //The model is NOT declaring an inner object-this is a type declaration
        type = modelVal[typeField];
        required = exists(modelVal[requiredField]) ? modelVal[requiredField] : false;
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
  constructor(obj, underscoreOptions=false) {
    this._modelObj = obj;
    this._alsoRequires = [];
    this._underscoreOptions=underscoreOptions;
  }

  alsoRequire(func) {
    this._alsoRequires.push(func);
  }

  check(obj) {
    if (!objectIsModelRemake(obj, this._modelObj, this._underscoreOptions)) {
      return false;
    }
    return this._alsoRequires.every(func => func(obj));
  }
  checkStrict(obj) {
    const typeField=this._underscoreOptions ? "_type":"type";
    if (!objectIsModelRemake(obj, this._modelObj)) {
      return false;
    }

    function checkKeys(object, model) {
      for (let [key, val] of Object.entries(object)) {
        let typeExists = exists(model[typeField]);
        let objType = typeExists ? model[typeField] : model[key];
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
    let strict = checkKeys(obj, this._modelObj);
    return strict && this._alsoRequires.every(func => func(obj));
  }
}
module.exports = Model;
