import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAllCategories, getAllTags, StrapiCollectionNames } from "@/entities/strapi";
import { routes } from "@/shared/router";

export async function POST(req: Request) {
  try {
    const request = await req.json();
    const { model, entry, secret } = request;

    // if (secret !== process.env.NEXT_REVALIDATION_SECRET_KEY) {
    //   console.log("Invalid secret:", secret);
    //   return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    // }

    let path = "";

    // Определяем path на основе коллекции
    switch (model) {
      case StrapiCollectionNames.article:
        path = `${routes.blog}${routes.article}/${entry?.url_name}`;
        await getAllCategories().then((data) => {
          data?.data?.categories.map((cat) => {
            revalidatePath(`${routes.blog}${routes.category}/${cat?.category}`);
          });
        });
        await getAllTags().then((data) => {
          data?.data?.tags.map((tag) => {
            revalidatePath(`${routes.blog}${routes.tag}/${tag?.tag}`);
          });
        });
        revalidatePath(routes.blog);
        break;
      case StrapiCollectionNames.category:
        path = `${routes.blog}${routes.category}/${entry?.category}`;
        revalidatePath(routes.blog);
        break;
      case StrapiCollectionNames.tag:
        path = `${routes.blog}${routes.tag}/${entry?.tag}`;
        revalidatePath(routes.blog);
        break;
      case StrapiCollectionNames.about:
        path = routes.about;
        break;
      case StrapiCollectionNames.partner:
        path = routes.partners;
        break;
      case StrapiCollectionNames.help:
        path = routes.help_faq;
        break;
      case StrapiCollectionNames.faq:
        path = routes.help_faq;
        break;
      case StrapiCollectionNames.topic:
        revalidatePath(routes.blog);
        break;
      default:
        console.log("Unknown model:", model);
        return NextResponse.json({ message: "Unknown model" }, { status: 400 });
    }

    console.log("Revalidating path:", path);
    revalidatePath(path);

    return NextResponse.json({ message: "Revalidation successful" });
  } catch (error) {
    console.error("Error during revalidation:", error);
    return NextResponse.json({ message: "Error during revalidation" }, { status: 500 });
  }
}
