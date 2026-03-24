import Image from 'next/image';
import Link from 'next/link';
import Arrow from "@/components/ui/icons/Arrow.svg"

export default function AboutTheaterSection() {
  return (
    <section className="bg-theater-dark py-8 px-4 sm:px-8">
      <div className="max-w-[1474px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-white text-3xl sm:text-4xl font-light mb-4">
              За Театъра
            </h2>

            <p className="text-gray-300 text-base leading-relaxed mb-6">
              Музикално-драматичен театър „Константин Кисимов“ е културното сърце на Велико Търново. 
              Носещ името на легендарния български актьор, театърът предлага богата програма от 
              драматични постановки, оперети, мюзикъли и вълнуващи детски спектакли, съчетавайки 
              традиции и новаторство на сцената.
            </p>

            <Link
              href="/about"
              className="inline-flex items-center text-white text-base font-light group transition-colors duration-300 hover:text-[#27AAE1]"
            >
              <span className="border-b border-transparent transition-all duration-300 group-hover:border-theater-hover hover:text-[#27AAE1] group-hover:text-[#27AAE1]">
                Виж още
              </span>
              <Arrow className="inline-block transition-transform duration-300 group-hover:translate-x-2 w-4 h-4 pl-2 fill-current group-hover:text-[#27AAE1]"></Arrow>
            </Link>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56">
              <Image
                src="/logo.svg"
                alt="Theater Icon"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
