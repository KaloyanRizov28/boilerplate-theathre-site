'use client';
import { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

export default function SeatMap({ venueData }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, isMobile: false });
  const [scale, setScale] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const currentTransformRef = useRef(null); // Store current transform to prevent zoom reset
  
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
  
  // Calculate total price of selected seats
  const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => {
      const priceTier = venueData.priceTiers.find(pt => pt.id === seat.priceTier);
      return total + (priceTier ? priceTier.price : 0);
    }, 0);
  };
  
  // Group selected seats by price tier
  const getGroupedSeats = () => {
    const groups = {};
    
    // Group seats by price tier
    selectedSeats.forEach(seat => {
      const tierKey = seat.priceTier || 'unknown';
      if (!groups[tierKey]) {
        groups[tierKey] = {
          seats: [],
          priceTier: venueData.priceTiers.find(pt => pt.id === tierKey)
        };
      }
      groups[tierKey].seats.push(seat);
    });
    
    return groups;
  };
  
  // Handle seat selection - FIXED
  const handleSeatSelection = (seat) => {
    if (seat.status !== "available") return;
    
    // Check if seat is already selected - use ID for comparison
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    
    // Debug log
    console.log("Handling seat selection:", seat.id, "Currently selected:", isSelected);
    
    if (isSelected) {
      // Remove seat from selection
      setSelectedSeats(prevSelected => 
        prevSelected.filter(s => s.id !== seat.id)
      );
      console.log("Deselecting seat:", seat.id);
    } else {
      // Add seat to selection
      setSelectedSeats(prevSelected => [...prevSelected, {...seat}]);
      console.log("Selecting seat:", seat.id);
    }
    
    // Important: Don't trigger zoom changes when seat selection happens
  };
  
  // Handle removing a seat from selection
  const removeSeat = (seatId) => {
    console.log("Removing seat by ID:", seatId);
    setSelectedSeats(prevSelected => prevSelected.filter(seat => seat.id !== seatId));
  };
  
  // Add debug logging for selection changes
  useEffect(() => {
    console.log("Selected seats updated:", selectedSeats.map(s => s.id));
  }, [selectedSeats]);
  
  // Handle resize - improved to be more responsive
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        // Detect if mobile
        const isMobile = window.innerWidth < 768;
        
        // Calculate responsive dimensions - adjust for sidebar
        const containerWidth = containerRef.current.clientWidth;
        const seatMapWidth = isMobile ? containerWidth : containerWidth * 0.75; // Make room for sidebar on desktop
        
        const maxHeight = isMobile ? 
                          window.innerHeight * 0.7 : // More compact on mobile
                          Math.min(900, window.innerHeight * 0.85);
        
        // Calculate aspect ratio based on venue bounds
        const bounds = calculateBounds();
        const aspectRatio = bounds.width / bounds.height;
        
        // Adjust width based on device
        const widthMultiplier = isMobile ? 1.2 : 1.2; // Less wide than before since we have sidebar
        const adjustedWidth = seatMapWidth * widthMultiplier;
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
  
  // Setup zoom behavior - MODIFIED to prevent auto-zooming on seat selection
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
        // Store current transform for preservation during updates
        currentTransformRef.current = event.transform;
        setScale(event.transform.k);
        svg.select('g.content-group')
          .attr('transform', event.transform);
      })
      .filter(event => {
        // Ignore double-click events by checking event.type
        if (event.type === 'dblclick') {
          event.preventDefault();
          return false;
        }
        // Allow touch events to pass through
        return !event.ctrlKey && !event.button && event.type !== 'contextmenu';
      });
    
    svg.call(zoom);
    
    // Only apply the initial transform if we don't have a stored transform
    // This prevents resetting zoom when selection changes
    if (!currentTransformRef.current) {
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
      
      // Store this as our current transform
      currentTransformRef.current = initialTransform;
      
      // Apply initial transform with a smooth transition
      svg.transition()
        .duration(300)
        .call(zoom.transform, initialTransform);
    } else {
      // Restore previous transform if we have one
      svg.call(zoom.transform, currentTransformRef.current);
    }
    
    return () => {
      svg.on('.zoom', null);
    };
  }, [dimensions, venueData]); // Re-run when dimensions or venueData change, NOT on selection changes
  
  // OPTIMIZED RENDERING: Split into two parts
  // 1. Initial render of the seating chart structure
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
    const content = svg.append("g")
      .attr("class", "content-group");
    
    // Add another invisible background rect inside the content group
    // This is crucial for mobile dragging to work properly
    content.append("rect")
      .attr("x", bounds.x)
      .attr("y", bounds.y)
      .attr("width", bounds.width)
      .attr("height", bounds.height)
      .attr("fill", "transparent")
      .attr("pointer-events", "all");
    
    // Add stage
    content.append("rect")
      .attr("class", "stage")
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
    
    // Add stage label
    content.append("text")
      .attr("class", "stage-label")
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
        .data(sectionSeats, d => d.id) // Use seat.id as key
        .enter()
        .append("rect")
        .attr("class", "seat")
        .attr("id", d => `seat-${d.id}`)
        .attr("data-id", d => d.id) // Store ID for easier selection later
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
              .attr("stroke-width", 2)
              .attr("fill-opacity", 0.8);
          }
        })
        .on("mouseout", function(event, d) {
          // FIXED: Check if seat is selected properly
          const isSelected = selectedSeats.some(s => s.id === d.id);
          if (d.status === "available" && !isSelected) {
            d3.select(this)
              .attr("stroke-width", 1)
              .attr("fill-opacity", 1);
          }
        })
        .on("click", function(event, d) {
          event.preventDefault();
          event.stopPropagation();
          
          // FIXED: Use the actual data object, not just a reference
          if (d.status === "available") {
            handleSeatSelection({...d});
          }
        })
        .on("touchend", function(event, d) {
          event.preventDefault();
          event.stopPropagation();
          
          // FIXED: Use the actual data object, not just a reference
          if (d.status === "available") {
            handleSeatSelection({...d});
          }
        });
      
      // Add seat labels
      section.selectAll(".seat-label")
        .data(sectionSeats, d => d.id) // Use seat.id as key
        .enter()
        .append("text")
        .attr("class", "seat-label")
        .attr("data-seat-id", d => d.id) // Store ID for easier selection later
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
        .attr("class", "row-label")
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
        .attr("class", "row-label")
        .attr("x", lastSeat + 20)
        .attr("y", midY)
        .attr("text-anchor", "start")
        .attr("dominant-baseline", "central")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("pointer-events", "none") // Ensure these don't block dragging
        .text(`Row ${rowName}`);
    });
    
    // IMPORTANT: After rendering all elements, restore the previous transform if exists
    // This prevents zoom reset when the chart re-renders due to seat selection
    if (currentTransformRef.current && svg.select('g.content-group').node()) {
      svg.select('g.content-group')
        .attr('transform', currentTransformRef.current);
    }
      
  }, [venueData, dimensions, selectedSeats]); 
  
  // 2. Separate effect to handle ONLY selection styling updates
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    
    // Update all seats based on selection state
    svg.selectAll(".seat").each(function() {
      const seat = d3.select(this);
      const seatId = seat.attr("data-id");
      const seatData = venueData.seats.find(s => s.id === seatId);
      
      if (!seatData) return;
      
      // FIXED: Check if this seat is selected properly using ID
      const isSelected = selectedSeats.some(s => s.id === seatId);
      
      // Debug
      if (isSelected) {
        console.log("Styling seat as selected:", seatId);
      }
      
      // Only update the styling attributes that change with selection
      if (isSelected) {
        // Selected styling
        seat
          .attr("fill", "#10b981") // Green color for selected
          .attr("stroke", "#047857") // Darker green border
          .attr("stroke-width", 2)
          .attr("fill-opacity", 1);
      } else if (seatData.status === "available") {
        // Standard styling for available seats
        const priceTier = venueData.priceTiers.find(pt => pt.id === seatData.priceTier);
        seat
          .attr("fill", priceTier ? priceTier.color : "#d1d5db")
          .attr("stroke", "#000000")
          .attr("stroke-width", 1)
          .attr("fill-opacity", 1);
      }
      // No need to update sold seats as they don't change
    });
    
    // Update seat label colors
    svg.selectAll(".seat-label").each(function() {
      const label = d3.select(this);
      const seatId = label.attr("data-seat-id");
      const seatData = venueData.seats.find(s => s.id === seatId);
      
      if (!seatData) return;
      
      // FIXED: Check if this seat is selected properly using ID
      const isSelected = selectedSeats.some(s => s.id === seatId);
      
      // Update text color based on selection
      if (isSelected) {
        label.attr("fill", "#ffffff"); // White text for selected seats
      } else {
        label.attr("fill", seatData.status === "sold" ? "#ffffff" : "#000000");
      }
    });
    
    console.log("Selection styling updated. Current selection:", selectedSeats.map(s => s.id));
    
  }, [selectedSeats, venueData.seats, venueData.priceTiers]); // Only re-run when selection changes
  
  return (
    <div className="w-full" ref={containerRef}>
      {/* Main content with seat map and sidebar */}
      <div className={`flex ${dimensions.isMobile ? 'flex-col' : 'flex-row'} gap-4`}>
        {/* Seat map container */}
        <div className={dimensions.isMobile ? 'w-full' : 'w-3/4'}>
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
          
          {/* Zoom info (moved below map) */}
          <div className="mt-2 text-sm text-gray-500 text-center">
            Zoom: {Math.round(scale * 100)}%
          </div>
          
          {/* Instructions - moved below map */}
          <div className="mt-2 text-sm text-gray-600 text-center">
            {dimensions.isMobile ? (
              <p>Pinch to zoom, drag to pan. Tap a seat to select it.</p>
            ) : (
              <p>Scroll to zoom, drag to pan. Click a seat to select it.</p>
            )}
          </div>
        </div>
        
        {/* Sidebar with legend and selections */}
        <div className={`${dimensions.isMobile ? 'w-full' : 'w-1/4'} flex flex-col gap-6`}>
          {/* Legend */}
          <div className="bg-gray-100 rounded-lg p-4 shadow-md">
            <h3 className="font-bold text-lg mb-3 text-black">Seat Legend</h3>
            <div className="flex flex-col gap-3">
              {venueData.priceTiers.map(tier => (
                <div key={tier.id} className="flex items-center">
                  <div 
                    className="w-6 h-6 mr-2 rounded border border-gray-400" 
                    style={{ backgroundColor: tier.color }}
                  ></div>
                  <span className="font-medium text-black ">{tier.name} ({tier.price}€)</span>
                </div>
              ))}
              <div className="flex items-center">
                <div className="w-6 h-6 mr-2 rounded border border-gray-400 bg-gray-500"></div>
                <span className="font-medium">Sold</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 mr-2 rounded border border-green-800 bg-green-500"></div>
                <span className="font-medium">Selected</span>
              </div>
            </div>
          </div>
          
          {/* Selected seats */}
          <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
            <h3 className="font-bold text-lg mb-3 text-black">Your Selection</h3>
            
            {selectedSeats.length === 0 ? (
              <p className="text-gray-500 italic">No seats selected yet</p>
            ) : (
              <div className="flex flex-col gap-2">
                {/* Group by price tier with counters */}
                {Object.entries(getGroupedSeats()).map(([tierKey, group], tierIndex) => {
                  const { seats, priceTier } = group;
                  const tierPrice = priceTier ? priceTier.price : 0;
                  const totalForTier = seats.length * tierPrice;
                  
                  return (
                    <div key={`tier-${tierKey}-${tierIndex}`} className="p-3 bg-gray-50 rounded border border-gray-200">
                      {/* Header with color indicator and count */}
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 mr-2 rounded" 
                            style={{ backgroundColor: priceTier ? priceTier.color : '#d1d5db' }}
                          ></div>
                          <span className="font-medium text-black">
                            {priceTier ? priceTier.name : 'Unknown'} ({tierPrice}€)
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium bg-gray-200 px-2 py-1 rounded text-sm text-black">
                            {seats.length} × {tierPrice}€ = {totalForTier}€
                          </span>
                        </div>
                      </div>
                      
                      {/* Seats within this tier */}
                      <div className="pl-6 text-sm text-gray-600">
                        {seats.map((seat, index) => (
                          <div key={`selection-${tierKey}-${seat.id}-${index}`} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                            <span className="text-black">Row {seat.row}, Seat {seat.number}</span>
                            <button
                              onClick={() => removeSeat(seat.id)}
                              className="text-red-500 hover:text-theater-hover p-1"
                              aria-label="Remove seat"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                
                {/* Total */}
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                  <span className="font-bold text-black">Total:</span>
                  <span className="font-bold text-black">{calculateTotalPrice()}€</span>
                </div>
                
                {/* Continue button */}
                <button
                  className="mt-4 bg-blue-600 hover:bg-theater-hover text-white font-bold py-2 px-4 rounded w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={selectedSeats.length === 0}
                >
                  Continue to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

SeatMap.propTypes = {
  venueData: PropTypes.object.isRequired
};