import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { StrapiCollectionNames } from "@/entities/strapi";
import { routes } from "@/shared/router";

export async function POST(req: Request) {
  try {
    const request = await req.json();
    const { model, entry, secret } = request;
    console.log(request);

    // if (secret !== process.env.NEXT_REVALIDATION_SECRET_KEY) {
    //   console.log("Invalid secret:", secret);
    //   return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    // }

    let path = "";

    // Определяем path на основе коллекции
    switch (model) {
      case StrapiCollectionNames.article:
        path = `${routes.blog}${routes.article}/${entry?.url_name}`;
        revalidatePath(routes.blog);
        revalidatePath(routes.category);
        revalidatePath(routes.tag);
        break;
      case StrapiCollectionNames.category:
        path = `${routes.blog}${routes.category}/${entry?.category}`;
        revalidatePath(routes.blog);
        revalidatePath(routes.category);
        revalidatePath(routes.tag);
        break;
      case StrapiCollectionNames.tag:
        path = `${routes.blog}${routes.tag}/${entry?.tag}`;
        revalidatePath(routes.blog);
        revalidatePath(routes.category);
        revalidatePath(routes.tag);
        break;
      case StrapiCollectionNames.about:
        path = routes.about;
        break;
      case StrapiCollectionNames.partner:
        path = routes.partners;
        break;
      case StrapiCollectionNames.help:
        path = routes.help;
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
