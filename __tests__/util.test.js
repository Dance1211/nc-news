const { isValidPositiveInteger, hasSpecificPropertyOnly } = require("../util/validation");

describe('validInteger', () => {
  test('Returns true for valid positive integer strings', () => {
    const validInputs = [
      '1',
      '15',
      '39',
      '235532',
      '999999999'
    ];
    expect(validInputs.every(isValidPositiveInteger)).toBe(true);
  });
  test('Returns false for invalid inputs', () => {
    const invalidInputs = [
      '-5',
      '5.0',
      '1e3',
      'fifteen',
      'notANumber',
      null,
      '10 + 15'
    ];
    expect(invalidInputs.some(isValidPositiveInteger)).toBe(false);
  });
});

describe('hasSpecificPropertyOnly', () => {
  test('Returns true for a valid object', () => {
    const inc_votesObject = { inc_votes: 10 };
    expect(hasSpecificPropertyOnly(inc_votesObject, "inc_votes", Number))
      .toBe(true);
    const nameObject = { name: "tom" };
    expect(hasSpecificPropertyOnly(nameObject, "name", String))
      .toBe(true);
  });
  test('Returns false for invalid objects', () => {
    const validObject = { inc_votes: 10 };
    const objectWithTooManyValues = { inc_votes: 10, dec_votes: -4 };
    // Wrong property
    expect(hasSpecificPropertyOnly(validObject, "invalidProp", String))
      .toBe(false);
    // Wrong type
    expect(hasSpecificPropertyOnly(validObject, "inc_votes", String))
      .toBe(false);
    // Too many properties
    expect(hasSpecificPropertyOnly(objectWithTooManyValues, "dec_votes", Number))
      .toBe(false);
  });
});