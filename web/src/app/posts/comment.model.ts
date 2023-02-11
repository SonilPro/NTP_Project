export class Comment {
  post_id: number;
  user_id: number;
  comment: string;

  constructor() {
    this.post_id = -1;
    this.user_id = -1;
    this.comment = '';
  }
}
