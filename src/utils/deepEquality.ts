import Comparator from "@pourianof/cobjs";

export function isDeepEqual(obj1: any, obj2: any) {
  return new Comparator(obj2, obj1).isEqual();
}
