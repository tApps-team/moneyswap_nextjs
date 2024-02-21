import { Post, Todo } from "@/shared/types";

export const getTodos = async (): Promise<Todo[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/todos`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export const getTodo = async (id: string): Promise<Todo> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/todos/${id}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export const getPosts = async (): Promise<Post[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export const getPost = async (id: string): Promise<Post> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${id}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
