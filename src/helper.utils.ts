export class Helper {
  static normalizeFirstname([capital, ...rest]: string) {
    return `${capital.toLocaleUpperCase()}${rest.join('').toLocaleLowerCase()}`;
  }
  
  static isObjectEmpty(obj?: object) {
    if (!obj) return true;
    return (Object.keys(obj).length === 0) ? true : false;
  }
}