export default function CaseStudyMetaGrid({ items }) {
  return (
    <section className="flex w-full flex-wrap gap-5">
      {items.map((item, index) => (
        <div
          key={item.label}
          className={`flex flex-col gap-1 ${index === 1 ? "w-[224px]" : "w-[223px]"}`}
        >
          <p className="font-ppmondwest text-[20px] leading-[1.25] text-[#484848] underline">
            {item.label}
          </p>
          <p
            className={`text-[14px] font-medium leading-[1.5] text-[#656565] ${
              item.label === "Role" ? "max-w-[200px]" : ""
            }`}
          >
            {item.value}
          </p>
        </div>
      ))}
    </section>
  );
}
