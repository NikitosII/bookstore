import Card from "antd/es/card/Card"
import { CardTitle } from "./CardTitle"
import Button from "antd/es/button/button"
import { Book } from "../models/Book";

interface Props {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

export const Books = ({ books, onEdit, onDelete }: Props) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="cards">
      {books.map((book: Book) => (
        <Card
          key={book.id}
          title={<CardTitle title={book.title} author={book.author} />}
          bordered={false}
        >
          <p>{book.description}</p>
          <p>Created: {formatDate(book.datetime)}</p>
          <div className="card_buttons">
            <Button
              onClick={() => onEdit(book)}
              style={{ flex: 1 }}
            >
              Edit
            </Button>
            <Button
              onClick={() => onDelete(book.id)}
              danger
              style={{ flex: 1 }}
            >
              Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}