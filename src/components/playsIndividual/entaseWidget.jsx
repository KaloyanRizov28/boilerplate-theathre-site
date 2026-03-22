'use client';
import { useEffect, useRef } from 'react';

export default function EntaseWidget({ productionId }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!productionId || !containerRef.current) return;

    const container = containerRef.current;
    
    // Clear the container for complete fresh re-renders during SPA navigation
    container.innerHTML = '';

    // Create the exact user-specified script snippet to ensure 100% compatibility
    const scriptInit = document.createElement('script');
    scriptInit.innerHTML = `
      window.entase = window.entase || new function(){this.o=[];this.show=function(v,a){this.o.push(v);if(a){var s=document.currentScript;var c=document.createElement('div');c.id='entase_'+v.obj;s.parentNode.insertBefore(c,s)}}};
      entase.show({
          obj: 'Production:${productionId}',
          width: 'auto',
          height: 'auto',
          theme: 'dark'
      }, true);
    `;

    // Create the synchronous/async loader provided by Entase
    const scriptLoad = document.createElement('script');
    scriptLoad.src = 'https://www.entase.com/api/js/events?api=2';
    scriptLoad.async = true;

    // Append script elements sequentially directly into the DOM container
    container.appendChild(scriptInit);
    container.appendChild(scriptLoad);

    return () => {
      // Cleanup on unmount (SPA exit)
      container.innerHTML = '';
    };
  }, [productionId]);

  if (!productionId) return null;

  return (
    <div 
      ref={containerRef} 
      className="entase-wrapper w-full mt-8 bg-transparent"
    >
      {/* Script injected dynamically inside here */}
    </div>
  );
}
