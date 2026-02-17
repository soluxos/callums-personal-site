import { cloneElement, isValidElement } from "react";
import { BentoGrid } from "react-bento";

const mergeClassName = (base, extra) => {
  if (!extra) return base;
  return `${base} ${extra}`.trim();
};

const buildElement = item => {
  const media = isValidElement(item.media)
    ? cloneElement(item.media, {
        className: mergeClassName(item.media.props.className ?? "", item.mediaClassName),
      })
    : item.media;

  return (
    <div className={mergeClassName("flex h-full flex-col", item.cardClassName)}>
      <div
        className={mergeClassName(
          "flex flex-1 min-h-0 items-center justify-center",
          item.mediaWrapperClassName
        )}
      >
        {media}
      </div>
      <div className={mergeClassName("flex flex-col gap-1 shrink-0", item.contentClassName)}>
        <p
          className={mergeClassName(
            "text-[18px] font-medium leading-[1.5] text-[#0f0f0f]",
            item.titleClassName
          )}
        >
          {item.title}
        </p>
        <p
          className={mergeClassName(
            "text-[14px] font-medium leading-[1.5] text-[#656565]",
            item.descriptionClassName
          )}
        >
          {item.description}
        </p>
      </div>
    </div>
  );
};

export default function CaseStudyBentoGrid({
  items,
  gridCols = 4,
  rowHeight = 227,
  containerClassName = "",
  elementContainerClassName = "",
}) {
  const bentoItems = items.map((item, index) => {
    const isLarge = index === 0 || index === 1;

    return {
      id: index + 1,
      title: item.title,
      element: buildElement(item),
      width: 1,
      height: isLarge ? 2 : 1,
    };
  });

  return (
    <BentoGrid
      items={bentoItems}
      gridCols={gridCols}
      rowHeight={rowHeight}
      classNames={{
        container: mergeClassName("w-full gap-5 p-0", containerClassName),
        elementContainer: mergeClassName(
          "rounded-[8px] bg-[#ededed] overflow-hidden",
          elementContainerClassName
        ),
      }}
    />
  );
}
