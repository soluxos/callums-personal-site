"use client";

import { cloneElement, isValidElement, useEffect, useState } from "react";
import { BentoGrid } from "react-bento";

const mergeClassName = (base, extra) => {
  if (!extra) return base;
  return `${base} ${extra}`.trim();
};

const DEFAULT_VARIANTS = {
  default: {
    cardClassName: "gap-4 p-5",
    mediaAreaClassName: "flex-1 min-h-0",
    mediaWrapperClassName: "flex-1 min-h-0",
    mediaClassName: "",
    contentAreaClassName: "",
    contentClassName: "",
    titleClassName: "",
    descriptionClassName: "",
  },
  designSystem: {
    cardClassName: "gap-4 p-5",
    mediaAreaClassName: "flex-1 min-h-0",
    mediaWrapperClassName: "flex-1 min-h-0",
  },
  "image-corner": {
    cardClassName: "gap-4 p-5",
    mediaAreaClassName: "flex-1 min-h-0",
    mediaWrapperClassName:
      "flex-1 min-h-0 overflow-hidden p-0 items-center justify-center sm:items-end sm:justify-center",
    mediaClassName: "sm:absolute sm:left-[20%] sm:bottom-[35%] sm:rotate-[-15deg]",
  },
  centered: {
    cardClassName: "gap-4 p-5",
    mediaAreaClassName: "flex-1 min-h-0",
    mediaWrapperClassName: "flex-1 min-h-0 items-center justify-center",
  },
  "image-full": {
    cardClassName: "",
    mediaAreaClassName: "flex-1 min-h-0",
    mediaWrapperClassName: "h-full w-full overflow-hidden",
    contentAreaClassName: "p-5 shrink-0",
  },
};

const getVariant = (variants, variantName) => variants[variantName] ?? variants.default;

const buildElement = (item, variants) => {
  const variant = getVariant(variants, item.variant);
  const media = isValidElement(item.media)
    ? cloneElement(item.media, {
        className: mergeClassName(
          mergeClassName(item.media.props.className ?? "", variant.mediaClassName),
          item.mediaClassName
        ),
      })
    : item.media;

  return (
    <div
      className={mergeClassName(
        mergeClassName("flex h-full flex-col", variant.cardClassName),
        item.cardClassName
      )}
    >
      <div
        data-area="media"
        className={mergeClassName(
          mergeClassName("flex", variant.mediaAreaClassName),
          item.mediaAreaClassName
        )}
      >
        <div
          className={mergeClassName(
            mergeClassName("flex", variant.mediaWrapperClassName),
            item.mediaWrapperClassName
          )}
        >
          {media}
        </div>
      </div>
      <div
        data-area="content"
        className={mergeClassName(
          mergeClassName("flex flex-col", variant.contentAreaClassName),
          item.contentAreaClassName
        )}
      >
        <div
          className={mergeClassName(
            mergeClassName("flex flex-col gap-1 shrink-0", variant.contentClassName),
            item.contentClassName
          )}
        >
          <p
            className={mergeClassName(
              mergeClassName(
                "text-[18px] font-medium leading-[1.5] text-[#0f0f0f]",
                variant.titleClassName
              ),
              item.titleClassName
            )}
          >
            {item.title}
          </p>
          <p
            className={mergeClassName(
              mergeClassName(
                "text-[14px] font-medium leading-[1.5] text-[#656565]",
                variant.descriptionClassName
              ),
              item.descriptionClassName
            )}
          >
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function CaseStudyBentoGrid({
  items,
  gridCols = 4,
  rowHeight = 227,
  variants = DEFAULT_VARIANTS,
  containerClassName = "",
  elementContainerClassName = "",
}) {
  const [responsiveCols, setResponsiveCols] = useState(gridCols);
  const [responsiveRowHeight, setResponsiveRowHeight] = useState(rowHeight);

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setResponsiveCols(1);
        setResponsiveRowHeight(200);
        return;
      }

      if (width < 1024) {
        setResponsiveCols(2);
        setResponsiveRowHeight(210);
        return;
      }

      setResponsiveCols(gridCols);
      setResponsiveRowHeight(rowHeight);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);

    return () => window.removeEventListener("resize", updateLayout);
  }, [gridCols, rowHeight]);

  const bentoItems = items.map((item, index) => {
    const isImageFull = item.variant === "image-full";
    const isLarge = !isImageFull && (index === 0 || index === 1);

    return {
      id: index + 1,
      title: item.title,
      element: buildElement(item, variants),
      width: 1,
      height: isLarge ? 2 : 1,
    };
  });

  return (
    <BentoGrid
      items={bentoItems}
      gridCols={responsiveCols}
      rowHeight={responsiveRowHeight}
      classNames={{
        container: mergeClassName("w-full gap-5 p-0", containerClassName),
        elementContainer: mergeClassName(
          "relative rounded-[8px] bg-[#ededed] overflow-hidden !p-0",
          elementContainerClassName
        ),
      }}
    />
  );
}
