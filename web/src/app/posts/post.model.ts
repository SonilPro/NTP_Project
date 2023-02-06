export class Post {
  id: number;
  datetime_published: string;
  content: string;
  user_id: number;

  constructor() {
    this.id = -1;
    this.datetime_published = '';
    this.content = '';
    this.user_id = -1;
  }
}
