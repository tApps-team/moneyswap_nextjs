export const ExchnagePage = ({ params }: { params: { slug: string[] } }) => {
  return <div>Exchnage {JSON.stringify(params.slug)}</div>;
};
