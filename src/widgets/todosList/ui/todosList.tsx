import styles from "./todosList.module.scss";
import { FC } from "react";
import { TodoCard } from "@/entities/todoCard";
import { Todo } from "@/shared/types";

interface TodosListProps {
  todos: Todo[];
}

export const TodosList: FC<TodosListProps> = (props) => {
  const { todos } = props;
  return (
    <section className={styles.todos}>
      {todos.map((todo) => (
        <TodoCard key={todo.id} todo={todo} />
      ))}
    </section>
  );
};
