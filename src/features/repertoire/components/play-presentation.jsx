import EntaseWidget from './entase-widget';
import PlayHero from './play-hero';

const PlayPresentation = ({
  playName,
  backgroundImage,
  heroHeight = "h-[80vh]",
  synopsis,
  ticketLink,
  productionId,
  ticketButtonText = "Билети →"
}) => {
  return (
    <div>
      <PlayHero
        playName={playName}
        backgroundImage={backgroundImage}
        heroHeight={heroHeight}
      />
      <div className="bg-theater-dark text-[#e0e0e0] px-4 sm:px-8 py-12 sm:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#27AAE1] rounded-full blur-[150px] opacity-10 pointer-events-none translate-x-1/4 -translate-y-1/4" />
        
        <div className="max-w-[1474px] mx-auto w-full relative z-10">
          <div className="w-full">
            <div className="flex items-center gap-6 mb-8">
               <span className="h-[2px] w-12 bg-[#27AAE1]" />
               <span className="text-[#27AAE1] uppercase tracking-[0.25em] text-sm font-medium">Синопсис</span>
            </div>
            
            <div className="relative pl-6 sm:pl-10 pr-6 sm:pr-10 pb-4">
               <span className="absolute left-0 top-[-10px] text-7xl text-[#27AAE1] opacity-20 font-serif leading-none">“</span>
               <p className="text-lg md:text-xl text-gray-300 font-light leading-[1.8] tracking-wide whitespace-pre-wrap relative z-10">
                 {synopsis}
               </p>
               <span className="absolute right-0 bottom-[-10px] text-7xl text-[#27AAE1] opacity-20 font-serif leading-none">”</span>
            </div>
          </div>
          
          <div className="mt-16 w-full">
            {productionId ? (
              <EntaseWidget productionId={productionId} />
            ) : ticketLink ? (
              <a
                href={ticketLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-neutral-700 text-white py-3 px-6 sm:py-4 sm:px-8 rounded text-lg sm:text-xl font-bold transition-colors transition-transform duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-theater-hover focus-visible:ring-opacity-75 hover:bg-[#27AAE1] hover:shadow-lg hover:scale-[1.03] hover:-translate-y-0.5 active:translate-y-0"
              >
                {ticketButtonText}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayPresentation;
