export default class User {
  constructor({ id, password, firstName, lastName, email }) {
    this.id = id;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }

  toJS() {
    return {
      id: this.id,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
    };
  }
}
