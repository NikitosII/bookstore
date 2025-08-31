export interface Book {
    id: string;
    title: string;
    author: string;
    description: string;
    datetime: string;
}

export interface BookRequest {
  title: string;
  author: string;
  description: string;
  datetime: string;
}