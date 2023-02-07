export class User {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;

  constructor() {
    this.id = -1;
    this.username = '';
    this.password = '';
    this.name = '';
    this.email = '';
  }
}
