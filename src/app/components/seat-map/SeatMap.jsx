'use client';
import { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

export default function SeatMap({ venueData }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, isMobile: false });
  const [scale, setScale] = useState(1);
  
  // Calculate the bounds of our venue to set up the viewBox
  const calculateBounds = () => {
    // Get all coordinates from seats and stage
    const allElements = [
      ...venueData.seats,
      venueData.stage
    ];
    
    // Find min and max coordinates
    const minX = Math.min(...allElements.map(el => el.x));
    const maxX = Math.max(...allElements.map(el => el.x + el.width));
    const minY = Math.min(...allElements.map(el => el.y));
    const maxY = Math.max(...allElements.map(el => el.y + el.height));
    
    // Add some padding
    const padding = 80; // Increased padding for better margins
    
    return {
      x: minX - padding,
      y: minY - padding,
      width: (maxX - minX) + (padding * 2),
      height: (maxY - minY) + (padding * 2)
    };
  };
  
  // Handle resize - improved to be more responsive
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        // Detect if mobile
        const isMobile = window.innerWidth < 768;
        
        // Calculate responsive dimensions - make it wider
        const containerWidth = containerRef.current.clientWidth;
        const maxHeight = isMobile ? 
                          window.innerHeight * 0.7 : // More compact on mobile
                          Math.min(900, window.innerHeight * 0.85);
        
        // Calculate aspect ratio based on venue bounds
        const bounds = calculateBounds();
        const aspectRatio = bounds.width / bounds.height;
        
        // Adjust width based on device
        const widthMultiplier = isMobile ? 1.2 : 1.4; // Less wide on mobile
        const adjustedWidth = containerWidth * widthMultiplier;
        let width = adjustedWidth;
        let height = adjustedWidth / aspectRatio;
        
        // Cap the height if needed, but preserve wider ratio
        if (height > maxHeight) {
          height = maxHeight;
          width = height * aspectRatio * widthMultiplier;
        }
        
        // Update dimensions state
        setDimensions({
          width: width,
          height: height,
          isMobile: isMobile
        });
      }
    };
    
    // Set initial dimensions
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Setup zoom behavior
  useEffect(() => {
    if (!svgRef.current) return;
    
    // Setup zoom behavior
    const svg = d3.select(svgRef.current);
    
    // Clear any existing zoom behavior
    svg.on('.zoom', null);
    
    // Calculate the center point for better zoom behavior
    const bounds = calculateBounds();
    
    // Create zoom behavior with better mobile support
    const zoom = d3.zoom()
      .scaleExtent([0.6, 6]) // Min zoom of 60% allows some zooming out while maintaining visibility
      .wheelDelta((event) => {
        // Make zooming smoother and more controlled
        return -event.deltaY * 0.002;
      })
      .on('zoom', (event) => {
        setScale(event.transform.k);
        svg.select('g')
          .attr('transform', event.transform);
      })
      .filter(event => {
        // Allow touch events to pass through
        return !event.ctrlKey && !event.button && event.type !== 'contextmenu';
      });
    
    svg.call(zoom);
    
    // Find the center point of all seats for better centering
    const allSeats = venueData.seats;
    const centerX = d3.mean(allSeats, d => d.x + d.width/2);
    const centerY = d3.mean(allSeats, d => d.y + d.height/2);
    
    // Calculate the SVG viewport center
    const viewportWidth = bounds.width;
    const viewportHeight = bounds.height;
    const viewportCenterX = bounds.x + viewportWidth/2;
    const viewportCenterY = bounds.y + viewportHeight/2;
    
    // Calculate the translation needed to center the seats
    const translateX = viewportCenterX - centerX;
    const translateY = viewportCenterY - centerY;
    
    // Create the initial transform with proper centering
    const initialScale = 1;
    const initialTransform = d3.zoomIdentity
      .translate(translateX, translateY)
      .scale(initialScale);
    
    // Apply initial transform with a smooth transition
    svg.transition()
      .duration(300)
      .call(zoom.transform, initialTransform);
    
    return () => {
      svg.on('.zoom', null);
    };
  }, [dimensions, venueData]); // Re-run when dimensions or venueData change
  
  // Render seat map
  useEffect(() => {
    if (!svgRef.current || !venueData || dimensions.width === 0) return;
    
    // Clear existing content
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Calculate bounds for viewBox
    const bounds = calculateBounds();
    
    // Set viewBox attribute
    const svg = d3.select(svgRef.current)
      .attr("viewBox", `${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("touch-action", "none"); // Critical for consistent touch behavior
    
    // Add an invisible rectangle to capture all touch/drag events
    svg.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "transparent")
      .attr("pointer-events", "all");
    
    // Create a group for all content
    const content = svg.append("g");
    
    // Add another invisible background rect inside the content group
    // This is crucial for mobile dragging to work properly
    content.append("rect")
      .attr("x", bounds.x)
      .attr("y", bounds.y)
      .attr("width", bounds.width)
      .attr("height", bounds.height)
      .attr("fill", "transparent")
      .attr("pointer-events", "all");
    
    // Add stage with improved touch/drag handling
    content.append("rect")
      .attr("x", venueData.stage.x)
      .attr("y", venueData.stage.y)
      .attr("width", venueData.stage.width)
      .attr("height", venueData.stage.height)
      .attr("fill", "#333333")
      .attr("stroke", "#000000")
      .attr("rx", 10)
      .attr("ry", 10)
      .attr("pointer-events", "all") // Enable pointer events specifically
      .attr("cursor", "grab"); // Show grab cursor to indicate draggable
    
    // Add stage label with improved visibility
    content.append("text")
      .attr("x", venueData.stage.x + venueData.stage.width / 2)
      .attr("y", venueData.stage.y + venueData.stage.height / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("fill", "white")
      .attr("font-size", "22px") // Bigger font
      .attr("font-weight", "bold")
      .attr("pointer-events", "none") // Make text non-blocking for touch events
      .text("STAGE");
    
    // Group seats by section for better organization
    const seatsBySection = d3.group(venueData.seats, d => d.section);
    
    // Process each section separately
    seatsBySection.forEach((sectionSeats, sectionId) => {
      const section = content.append("g")
        .attr("class", `section-${sectionId}`);
      
      // Add seats
      section.selectAll(".seat")
        .data(sectionSeats)
        .enter()
        .append("rect")
        .attr("class", "seat")
        .attr("id", d => `seat-${d.id}`)
        .attr("x", d => d.x)
        .attr("y", d => d.y)
        .attr("width", d => d.width)
        .attr("height", d => d.height)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("fill", d => {
          if (d.status === "sold") return "#6b7280";
          const priceTier = venueData.priceTiers.find(pt => pt.id === d.priceTier);
          return priceTier ? priceTier.color : "#d1d5db";
        })
        .attr("stroke", "#000000")
        .attr("stroke-width", 1)
        .attr("cursor", d => d.status === "available" ? "pointer" : "default")
        .on("mouseover", function(event, d) {
          if (d.status === "available") {
            d3.select(this)
              .attr("stroke", "#000000")
              .attr("stroke-width", 2)
              .attr("fill-opacity", 0.8);
          }
        })
        .on("mouseout", function(event, d) {
          if (d.status === "available") {
            d3.select(this)
              .attr("stroke", "#000000")
              .attr("stroke-width", 1)
              .attr("fill-opacity", 1);
          }
        })
        .on("touchstart", function(event, d) {
          // Prevent default behavior to avoid browser scroll/zoom
          event.preventDefault();
          
          if (d.status === "available") {
            d3.select(this)
              .attr("stroke", "#000000")
              .attr("stroke-width", 2)
              .attr("fill-opacity", 0.8);
          }
        });
      
      // Add seat labels
      section.selectAll(".seat-label")
        .data(sectionSeats)
        .enter()
        .append("text")
        .attr("class", "seat-label")
        .attr("x", d => d.x + d.width / 2)
        .attr("y", d => d.y + d.height / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("pointer-events", "none") // Important for mobile to ensure these don't block events
        .attr("fill", d => d.status === "sold" ? "#ffffff" : "#000000")
        .text(d => d.number);
    });
    
    // Add row labels - for better navigation
    const rowLabels = [];
    venueData.seats.forEach(seat => {
      if (!rowLabels.includes(`${seat.section}-${seat.row}`)) {
        rowLabels.push(`${seat.section}-${seat.row}`);
      }
    });
    
    // Group seats by row
    const seatsByRow = d3.group(venueData.seats, d => `${d.section}-${d.row}`);
    
    // Add row labels
    seatsByRow.forEach((rowSeats, rowId) => {
      // Find leftmost seat in row
      const firstSeat = d3.min(rowSeats, d => d.x);
      const lastSeat = d3.max(rowSeats, d => d.x + d.width);
      const midY = rowSeats[0].y + rowSeats[0].height / 2;
      
      // Extract row name without section prefix
      const rowName = rowSeats[0].row;
      
      // Add row label on the left
      content.append("text")
        .attr("x", firstSeat - 20)
        .attr("y", midY)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "central")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("pointer-events", "none") // Ensure these don't block dragging
        .text(`Row ${rowName}`);
        
      // Add row label on the right
      content.append("text")
        .attr("x", lastSeat + 20)
        .attr("y", midY)
        .attr("text-anchor", "start")
        .attr("dominant-baseline", "central")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("pointer-events", "none") // Ensure these don't block dragging
        .text(`Row ${rowName}`);
    });
      
  }, [venueData, dimensions]);
  
  return (
    <div className="w-full" ref={containerRef}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{venueData.name}</h2>
        <div className="flex space-x-2">
          <span className="text-sm font-medium py-1">
            Zoom: {Math.round(scale * 100)}%
          </span>
        </div>
      </div>
      
      <div 
        className="flex items-center justify-center overflow-hidden"
        style={{
          WebkitUserSelect: "none", 
          MozUserSelect: "none",
          msUserSelect: "none",
          userSelect: "none", 
          touchAction: "none" // Critical for touch handling on mobile
        }}
      >
        <svg 
          ref={svgRef} 
          width={dimensions.width} 
          height={dimensions.height}
          className="border border-gray-300 rounded-lg bg-gray-50 shadow-lg" 
          style={{
            touchAction: "none",  // Critical for mobile touch handling
            WebkitTapHighlightColor: "transparent",  // Remove tap highlight on mobile
            outline: "none",  // Remove outline on focus for better aesthetics
          }}
        ></svg>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-6 p-2 bg-gray-100 rounded-lg">
        {venueData.priceTiers.map(tier => (
          <div key={tier.id} className="flex items-center">
            <div 
              className="w-6 h-6 mr-2 rounded border border-gray-400" 
              style={{ backgroundColor: tier.color }}
            ></div>
            <span className="font-medium">{tier.name} ({tier.price}€)</span>
          </div>
        ))}
        <div className="flex items-center">
          <div className="w-6 h-6 mr-2 rounded border border-gray-400 bg-gray-500"></div>
          <span className="font-medium">Sold</span>
        </div>
      </div>
      
      {/* Mobile instructions */}
      {dimensions.isMobile && (
        <div className="mt-4 text-sm text-gray-600 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="font-medium">Mobile tips:</p>
          <ul className="list-disc pl-5 mt-1">
            <li>Pinch to zoom in/out</li>
            <li>Use one or two fingers to pan/drag</li>
            <li>Tap a seat to select it</li>
          </ul>
        </div>
      )}
      
      {/* Desktop instructions */}
      {!dimensions.isMobile && (
        <div className="mt-4 text-sm text-gray-600">
          <p>Scroll to zoom, drag to pan around the seating chart.</p>
        </div>
      )}
    </div>
  );
}

SeatMap.propTypes = {
  venueData: PropTypes.object.isRequired
};