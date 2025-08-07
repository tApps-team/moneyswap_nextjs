"use client";

import { Dot } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import { TableOfContents } from "@/entities/strapi";

interface TableOfContentsBlockProps {
  table_of_contents: TableOfContents[];
}

export const TableOfContentsBlock: FC<TableOfContentsBlockProps> = ({ table_of_contents }) => {
  const [activeId, setActiveId] = useState<string | null>(table_of_contents[0].id);
  const tocContainerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -80% 0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, observerOptions);

    const elements = table_of_contents
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];
    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) => observer.unobserve(element));
    };
  }, [table_of_contents]);

  useEffect(() => {
    if (activeId && itemRefs.current[activeId] && window.innerWidth > 576) {
      const activeElement = itemRefs.current[activeId];
      const container = tocContainerRef.current;

      if (activeElement && container) {
        const elementTop = activeElement.offsetTop;
        const elementHeight = activeElement.offsetHeight;
        const containerScrollTop = container.scrollTop;
        const containerHeight = container.offsetHeight;

        if (elementTop > containerScrollTop) {
          container.scrollTo({
            top: elementTop - containerHeight + elementHeight,
            behavior: "smooth",
          });
        } else if (elementTop + elementHeight > containerScrollTop + containerHeight) {
          container.scrollTo({
            top: elementTop - containerHeight + elementHeight,
            behavior: "smooth",
          });
        }
      }
    }
  }, [activeId]);

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
      const scrollPosition = elementTop - offset;
      window.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="grid grid-flow-row gap-3 rounded-[10px] md:bg-new-light-grey bg-new-dark-grey py-4 px-1">
      <div className="px-3">
        <h3 className="text-yellow-main uppercase font-bold xl:text-lg lg:text-base text-sm truncate lg:min-w-auto md:min-w-[24vw] lg:min-w-fit min-w-auto">
          Оглавление
        </h3>
      </div>
      <div
        ref={tocContainerRef}
        className="grid grid-flow-row gap-2 px-3 overflow-y-auto lg:max-h-[25svh] max-h-[15svh]"
      >
        {table_of_contents?.map((item, index) => (
          <li
            key={index}
            ref={(el) => {
              itemRefs.current[item.id] = el;
            }}
            className={`relative grid grid-flow-col gap-2 justify-start items-center max:text-base xl:text-sm text-xs font-normal`}
          >
            <span
              className={`absolute left-[9.5px] w-[1px] bg-[#575A62] ${index === 0 ? "top-[50%] bottom-0" : index === table_of_contents?.length - 1 ? "top-0 bottom-[50%]" : "-top-2 -bottom-2"}`}
            ></span>
            <Dot
              width={20}
              height={20}
              stroke={item?.id === activeId ? "#f6ff5f" : "#575A62"}
              className={`${item?.id === activeId ? "scale-[4.5] transition-all duration-300" : "scale-[2]"}`}
            />
            <a
              className={`${item?.id === activeId ? "text-yellow-main" : "text-white"} line-clamp-2`}
              href={`#${item?.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleScroll(item?.id);
              }}
            >
              {item?.title}
            </a>
          </li>
        ))}
      </div>
    </section>
  );
};
