import { getTodos } from "@/shared/api/getData";
import { TodosList } from "@/widgets/todosList";

export const Todos = async () => {
  const todos = await getTodos();
  return (
    <section>
      <h1>TODOS PAGE</h1>
      <TodosList todos={todos} />
    </section>
  );
};
