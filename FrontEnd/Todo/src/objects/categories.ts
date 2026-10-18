export interface MongoId {
  $oid: string;
}

export interface Todo {
  _id: string;
  title?: string;
  importancy?:string
  dueTime?: string;
  finished:boolean;
}

export interface Category {
  _id: string;
  title: string;
  description: string;
  style: {
    background: string;
    image: string;
  };
  groupTodo: Todo[];
}

export interface CategoriesUser {
  _id: MongoId;
  username: string;
  categories:{
    categoryType: string;
    category: Category[];
  }[];

  __v: number;
}

