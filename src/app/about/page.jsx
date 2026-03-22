import Image from 'next/image';
import Link from 'next/link';
import Arrow from '@/components/ui/icons/Arrow.svg';

export default function AboutPage() {
  return (
    <>
      <section className="bg-theater-dark px-4 sm:px-8 py-8 sm:py-16">
        <div className="max-w-[1474px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
            <h1 className="text-white text-4xl sm:text-5xl font-light mb-8">За театъра</h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Музикално-драматичен театър „Константин Кисимов“ е сред най-емблематичните културни институции 
              в България, разположен в историческата и духовна столица Велико Търново. Носещ името на 
              забележителния актьор Константин Кисимов, театърът е дом на богато разнообразие от изкуства – 
              от класическа и съвременна драма до великолепни оперети, мюзикъли и детски постановки. 
              Със своите талантливи артисти, впечатляваща сценография и непрестанен стремеж към творческо 
              развитие, МДТ „Константин Кисимов“ продължава да вдъхновява и радва публиката от всички възрасти.
            </p>
            <div className="flex gap-4 justify-start">

              <Link
                href="/cast"
                className="inline-flex items-center text-white text-xl font-light group transition-colors duration-300 hover:text-[#27AAE1]"
              >

                <span className="border-b border-transparent transition-all duration-300 group-hover:border-theater-hover hover:text-[#27AAE1] group-hover:text-[#27AAE1]">
                  Състав
                </span>
                <Arrow className="inline-block transition-transform duration-300 group-hover:translate-x-2 w-6 h-6 pl-2 fill-current  
                  group-hover:text-[#27AAE1]" />
              </Link>

              <Link
                href="/scenes"
                className="inline-flex items-center text-white text-xl font-light group transition-colors duration-300 hover:text-[#27AAE1]"
              >

                <span className="border-b border-transparent transition-all duration-300 group-hover:border-theater-hover hover:text-[#27AAE1] group-hover:text-[#27AAE1]">
                  Сцени
                </span>
                <Arrow className="inline-block transition-transform duration-300 group-hover:translate-x-2 w-6 h-6 pl-2 fill-current group-hover:text-[#27AAE1]" />
              </Link>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80">
              <Image src="/logo.svg" alt="Theater Icon" fill className="object-contain" />
            </div>
          </div>
        </div>
        </div>
      </section>
      <section className="bg-gray-200 text-theater-dark px-4 sm:px-8 h-96 flex items-center justify-center text-center">
        <div className="max-w-[1474px] mx-auto w-full">
          <p className="text-2xl">
            snimka na teatura (mojebi ot vutre che da ne e grozna XD XD)
          </p>
        </div>
      </section>
    </>
  );
}
