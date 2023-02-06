export class User {
  _id: number;
  username: string;
  password: string;
  name: string;
  email: string;

  constructor() {
    this._id = -1;
    this.username = '';
    this.password = '';
    this.name = '';
    this.email = '';
  }
}
