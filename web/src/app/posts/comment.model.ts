export class Comment {
  id: number;
  post_id: number;
  user_id: number;
  comment: string;

  constructor() {
    this.id = -1;
    this.post_id = -1;
    this.user_id = -1;
    this.comment = '';
  }
}
