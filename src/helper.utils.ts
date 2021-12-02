export class Helper {
  static normalizeFirstname([capital, ...rest]: string) {
    return `${capital.toLocaleUpperCase()}${rest.join('').toLocaleLowerCase()}`;
  }
}