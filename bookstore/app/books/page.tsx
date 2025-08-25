"use client";
import { Button, message, Spin } from "antd";
import { Books } from "../components/Book";
import { useEffect, useState } from "react";
import {
  BookRequest,
  Create,
  Delete,
  GetAll,
  Update,
  GetWithFilter,
  FilterParams,
} from "../services/books";
import { CreateUpdateBook, Mode } from "../components/CreateUpdateBook";
import { Filter } from "../components/BookFilter";

export default function BookPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState(Mode.Create);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [filterLoading, setFilterLoading] = useState(false);

  const fetchBooks = async (filterParams?: FilterParams) => {
    try {
      if (filterParams && Object.keys(filterParams).length > 0) {
        setFilterLoading(true);
      } else {
        setLoading(true);
      }
      
      const data = filterParams && Object.keys(filterParams).length > 0 
        ? await GetWithFilter(filterParams) 
        : await GetAll();
      
      setBooks(data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
      message.error('Failed to fetch books');
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  };

  const handleCreateBook = async (request: BookRequest) => {
    try {
      await Create(request);
      message.success('Book created successfully');
      await fetchBooks();
      return true;
    } catch (error) {
      console.error('Failed to create book:', error);
      message.error('Failed to create book');
      return false;
    }
  };

  const handleUpdateBook = async (id: string, request: BookRequest) => {
    try {
      await Update(id, request);
      message.success('Book updated successfully');
      await fetchBooks();
      return true;
    } catch (error) {
      console.error('Failed to update book:', error);
      message.error('Failed to update book');
      return false;
    }
  };

  const handleDeleteBook = async (id: string) => {
    try {
      await Delete(id);
      message.success('Book deleted successfully');
      await fetchBooks();
    } catch (error) {
      console.error('Failed to delete book:', error);
      message.error('Failed to delete book');
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => {
          setMode(Mode.Create);
          setCurrentBook(null);
          setIsModalOpen(true);
        }}
      >
        Add Book
      </Button>
      
      <Filter onFilter={fetchBooks} loading={filterLoading} />
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: 50 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Books
          books={books}
          onEdit={(book: Book) => {
            setMode(Mode.Edit);
            setCurrentBook(book);
            setIsModalOpen(true);
          }}
          onDelete={handleDeleteBook}
        />
      )}
      
      <CreateUpdateBook
        mode={mode}
        values={currentBook || { id: '', title: '', author: '', description: '', datetime: '' }}
        isModalOpen={isModalOpen}
        handleCreate={handleCreateBook}
        handleUpdate={handleUpdateBook}
        handleCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
}