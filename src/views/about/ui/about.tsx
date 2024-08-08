import { getAboutPage } from "@/shared/api";

export const AboutPage = async () => {
  const { data } = await getAboutPage();
  console.log(data);
  return (
    <section>
      <h1>ABOUT PAGE</h1>
      <div className="strapi_styles" dangerouslySetInnerHTML={{ __html: data?.content }} />
    </section>
  );
};
