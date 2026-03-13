import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="font-satoshi flex flex-col items-center justify-center min-h-[200px] w-full">
      {/* 404 Section */}
      <section className="flex w-full h-[200px] relative flex-col items-center justify-center">
        <div className="flex flex-col items-center text-center max-w-[750px] px-10 md:px-15 lg:px-20">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-[#FF2B00] font-departure-mono text-8xl md:text-9xl lg:text-[12rem] font-bold leading-none">
              404
            </h1>
          </div>
          {/* Error Message */}
          <div className="mb-8">
            <p className="text-[#626262] text-[12px] mb-4 font-departure-mono uppercase">
              Oops, looks like you&apos;re lost
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
