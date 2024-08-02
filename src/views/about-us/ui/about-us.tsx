import { getAboutUsPage } from "@/shared/api";

export const AboutUs = async () => {
  const { data } = await getAboutUsPage();
  console.log(data);
  return (
    <section>
      <h1>ABOUT US PAGE</h1>
      <div className="strapi_styles" dangerouslySetInnerHTML={{ __html: data?.content }} />
    </section>
  );
};
