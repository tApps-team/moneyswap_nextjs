import { routes } from "@/shared/router";
import Link from "next/link";
import { FC } from "react";
import styles from "./todoCard.module.scss";
import { Todo } from "@/shared/types";

interface TodoCardProps {
  todo: Todo;
}

export const TodoCard: FC<TodoCardProps> = (props) => {
  const { todo } = props;
  return (
    <Link className={`link ${styles.todo}`} href={`${routes.todos}/${todo.id}`}>
      {todo.id}. {todo.title}
    </Link>
  );
};
