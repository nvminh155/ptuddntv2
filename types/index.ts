import { ImageSourcePropType } from "react-native";

type Book = {
  id: number;
  bookName: string;
  bookCover: ImageSourcePropType;
  rating: number;
  language: string;
  pageNo: number;
  author: string;
  genre: string[];
  readed: string;
  description: string;
  backgroundColor: string;
  navTintColor: string;
};

type MyBook = Book & {
  completion: string;
  lastRead: string;
};

type Category = {
  id: number;
  categoryName: string;
  books: Book[];
};

export { Book, Category, MyBook };

