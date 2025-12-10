import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getAllCategories, getAllTags, StrapiCollectionNames } from "@/entities/strapi";
import { routes } from "@/shared/router";

export async function POST(req: Request) {
  try {
    const request = await req.json();
    const { model, entry, secret } = request;

    console.log("=== REVALIDATION REQUEST ===");
    console.log("Model:", model);
    console.log("Entry:", JSON.stringify(entry, null, 2));
    console.log("Expected model value:", StrapiCollectionNames.article);

    // if (secret !== process.env.NEXT_REVALIDATION_SECRET_KEY) {
    //   console.log("Invalid secret:", secret);
    //   return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    // }

    let path = "";

    // Определяем path на основе коллекции
    switch (model) {
      case StrapiCollectionNames.article:
        path = `${routes.blog}${routes.article}/${entry?.url_name}`;
        console.log("Article path constructed:", path);
        // Инвалидируем теги кэша для статьи
        revalidateTag('article');
        if (entry?.url_name) {
          revalidateTag(`article-${entry.url_name}`);
          console.log("✓ Tag revalidated: article-" + entry.url_name);
        }
        // Инвалидируем путь страницы
        revalidatePath(path);
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
        console.log("Category path constructed:", path);
        // Инвалидируем теги кэша для категории
        revalidateTag('categories');
        revalidateTag('category-articles');
        if (entry?.category) {
          revalidateTag(`category-${entry.category}`);
          console.log("✓ Tag revalidated: category-" + entry.category);
        }
        revalidatePath(path);
        revalidatePath(routes.blog);
        break;
      case StrapiCollectionNames.tag:
        path = `${routes.blog}${routes.tag}/${entry?.tag}`;
        console.log("Tag path constructed:", path);
        // Инвалидируем теги кэша для тега
        revalidateTag('tags');
        revalidateTag('tag-articles');
        if (entry?.tag) {
          revalidateTag(`tag-${entry.tag}`);
          console.log("✓ Tag revalidated: tag-" + entry.tag);
        }
        revalidatePath(path);
        revalidatePath(routes.blog);
        break;
      case StrapiCollectionNames.about:
        path = routes.about;
        console.log("About path constructed:", path);
        // Инвалидируем теги кэша для about
        revalidateTag('about');
        revalidatePath(path);
        break;
      case StrapiCollectionNames.partner:
        path = routes.partners;
        console.log("Partner path constructed:", path);
        // Инвалидируем теги кэша для partner
        revalidateTag('partner');
        revalidatePath(path);
        break;
      case StrapiCollectionNames.help:
        path = routes.help_faq;
        console.log("Help path constructed:", path);
        // Инвалидируем теги кэша для help
        revalidateTag('help');
        revalidatePath(path);
        break;
      case StrapiCollectionNames.faq:
        path = routes.help_faq;
        console.log("FAQ path constructed:", path);
        // Инвалидируем теги кэша для FAQ
        revalidateTag('faq');
        // Если есть тип FAQ, инвалидируем конкретный тег
        if (entry?.type) {
          revalidateTag(`faq-${entry.type}`);
          console.log("✓ Tag revalidated: faq-" + entry.type);
        }
        revalidatePath(path);
        break;
      case StrapiCollectionNames.topic:
        console.log("Topic revalidation");
        // Инвалидируем теги кэша для topic
        revalidateTag('topic-articles');
        if (entry?.type) {
          revalidateTag(`topic-${entry.type}`);
          console.log("✓ Tag revalidated: topic-" + entry.type);
        }
        revalidatePath(routes.blog);
        break;
      default:
        console.log("Unknown model:", model);
        return NextResponse.json({ message: "Unknown model" }, { status: 400 });
    }

    console.log("=== REVALIDATION COMPLETE ===");

    return NextResponse.json({ 
      message: "Revalidation successful",
      path: path || "none",
      model: model 
    });
  } catch (error) {
    console.error("Error during revalidation:", error);
    return NextResponse.json({ message: "Error during revalidation" }, { status: 500 });
  }
}
