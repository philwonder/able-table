export type NestedKeyOf<T extends object> = {
  [Key in keyof T & (string | number)]: T[Key] extends Array<any>
    ? `${Key}`
    : T[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<T[Key]>}`
    : `${Key}`;
}[keyof T & string];

// export type NestedKeyOf<T extends object> = {
//   [Key in keyof T & (string | number)]: T[Key] extends Array<any>
//     ? Key
//     : T[Key] extends object
//     ? Key | NestedKeyOf<T[Key]>
//     : Key;
// }[keyof T & string];

export type OneOf<T extends object> = {
  [K in keyof T]: { [key in Exclude<keyof T, K>]?: undefined } & Pick<T, K>;
}[keyof T];

const test = {
  boardNumber: 1,
  handicap: 0,
  wallTime: "8:00pm",
  hasGameRecord: false,
  black: {
    givenName: "Philip",
    familyName: "Wonder",
    address: {
      country: "Canada",
      province: "Ontario",
      city: "Hamilton",
    },
    rank: 30,
    isMatchTimeAccepted: true,
  },
  white: {
    givenName: "Nick",
    familyName: "Prince",
    address: {
      country: "Canada",
      province: "Ontario",
      city: "Hamilton",
    },
    rank: 32,
    isMatchTimeAccepted: true,
  },
};
