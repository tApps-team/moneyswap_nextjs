import { getTodo } from "@/shared/api/getData";

interface TodoProps {
  params: {
    id: string;
  };
}

export const Todo = async (props: TodoProps) => {
  const { id } = props.params;
  const todo = await getTodo(id);
  return (
    <section>
      <h1>
        {todo.id}. {todo.title}
      </h1>
    </section>
  );
};
