import { getAboutPage } from "@/shared/api";

export const AboutPage = async () => {
  const { data } = await getAboutPage();
  console.log(data);
  return (
    <section>
      <div className="strapi_styles" dangerouslySetInnerHTML={{ __html: data?.content }} />
    </section>
  );
};
