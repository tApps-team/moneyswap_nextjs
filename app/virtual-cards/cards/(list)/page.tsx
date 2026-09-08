import { permanentRedirect } from "next/navigation";
import { routes } from "@/shared/router";

export default function Page() {
  permanentRedirect(routes.virtual_cards);
}
