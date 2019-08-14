function objectIsModel(object, model) {
  let match = true;
  function checkArr(type, val) {
    return Array.isArray(val) && val.every(item => type.prototype.isPrototypeOf(Object(item)));
  }
  for (let [key, val] of Object.entries(object)) {
    if (model[key]) {
      if (val && !Array.isArray(val) && typeof(val) == "object") {
        match = objectIsModel(val, model[key]);
        if (!match) break;
        else continue;
      } else if (val && Array.isArray(model[key]) && typeof(model[key][0]) === "object") {
        match = val.every(item => objectIsModel(item, model[key][0]));
        if (!match) break;
        else continue;
      }
      let required = false;
      let array = false;
      let type;
      if (!Array.isArray(model[key]) && typeof(model[key]) === "object") {
        required = model[key].required || false;
        array = Array.isArray(model[key].type);
        type = array ? model[key].type[0] : model[key].type;
      } else {
        array = Array.isArray(model[key]);
        type = array ? model[key][0] : model[key];
      }
      if (!type) {
        match = false;
        break;
      }
      if (typeof(val) != "boolean" && !val) {
        if (required) {
          continue;
        } else {
          match = false;
          break;
        }
      } else if (array) {
        match = checkArr(type, val);
      } else {
        match = type.prototype.isPrototypeOf(Object(val));
      }
    } else {
      match = false;
      break;
    }
  }
  return match;
}

class Model{
  constructor(obj){
    this._modelObj=obj;
    this._alsoRequires=[];
  }

  alsoRequire(func){
    this._alsoRequires.push(func);
  }

  check(obj){
    if(!objectIsModel(obj, this._modelObj)){
      return false;
    }
    return this._alsoRequires.every(func=>func(object));
  }
}
