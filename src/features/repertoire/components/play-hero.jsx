import Image from 'next/image';

const PlayHero = ({
  playName,
  backgroundImage,
  heroHeight = "h-screen"
}) => {
  const imgSrc = backgroundImage || '/hero.jpg'

  return (
    <div className={`w-full ${heroHeight} relative flex flex-col justify-end items-center text-white bg-theater-dark`}>
      <Image
        src={imgSrc}
        alt={playName ? `Background for ${playName}` : "Play hero background"}
        fill
        quality={80}
        priority
        className="z-0 object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-theater-dark via-theater-dark/40 to-black/20 z-10" />

      <div className="relative z-20 w-full flex justify-center px-4 sm:px-8 pb-4 sm:pb-6">
        <div className="w-full max-w-[1474px]">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light uppercase tracking-wide drop-shadow-md pb-2">
            {playName}
          </h1>
        </div>
      </div>
    </div>
  )
}

export default PlayHero;
