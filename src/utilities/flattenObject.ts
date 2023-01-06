export function flattenObject(ob: any) {
  let toReturn = {};

  for (let i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if (typeof ob[i] == 'object' && ob[i] !== null) {
      let flatObject = flattenObject(ob[i]);
      for (let x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        (toReturn as any)[i + '.' + x] = (flatObject as any)[x];
      }
    } else {
      (toReturn as any)[i] = ob[i];
    }
  }
  return toReturn;
}
