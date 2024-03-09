"use client";

import Image from "next/image";
import { useCountryStore } from "@/entities/country";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from "@/shared/ui";

export const CountryModal = () => {
  const country = useCountryStore((state) => state.country);
  return (
    <Dialog>
      <DialogTrigger asChild>
        {country ? (
          <Button>
            <Image
              width={32}
              height={32}
              src={country.icon_url}
              alt={`country ${country.name.ru}`}
            />
            <div>Выберите город</div>
          </Button>
        ) : (
          <Button>Выберите город </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Выбрать город</DialogTitle>
          <DialogDescription>
            <Input placeholder="Поиск города и страны" />
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
