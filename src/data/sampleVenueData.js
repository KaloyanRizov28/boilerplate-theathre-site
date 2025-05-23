// data/venueData.js
export const venueData = {
  // Venue information
  name: "Concert Hall",
  
  // Stage area (at the bottom of the chart)
  stage: {
    x: 400,
    y: 880, // Positioned at the bottom
    width: 300,
    height: 50
  },
  
  // Different sections with price levels
  sections: [
    {
      id: "upperGold",
      name: "Upper Gold Section", // Rows 3-7 in upper section (gold/brown)
    },
    {
      id: "upperPurple",
      name: "Upper Premium Section", // Rows 1-2 in upper section (purple)
    },
    {
      id: "lowerGold",
      name: "Lower Gold Section", // Rows 9-15 in lower section (gold/brown)
    },
    {
      id: "lowerPurple",
      name: "Lower Premium Section", // Rows 1-8 in lower section (purple)
    }
  ],
  
  // Price tiers
  priceTiers: [
    {
      id: "premium",
      name: "Premium",
      price: 120,
      color: "#9333ea" // Purple color for purple seats
    },
    {
      id: "standard",
      name: "Standard",
      price: 80,
      color: "#b45309" // Gold/brown color for gold seats
    },
    {
      id: "sold",
      name: "Sold",
      price: 0,
      color: "#dc2626" // Red for sold seats
    }
  ],
  
  // Generate the seats
  seats: [
    // This is where we'd generate all seats (approximately 700-710)
    // I'll include a sample for one row in each section, and then we would 
    // generate the rest with similar patterns
    
    // === UPPER SECTION ===
    // Upper Section Row 1 (Purple) - Example seats
    { id: "U1-1", row: "1", number: 1, x: 180, y: 320, width: 16, height: 16, section: "upperPurple", priceTier: "premium", status: "available" },
    { id: "U1-2", row: "1", number: 2, x: 200, y: 320, width: 16, height: 16, section: "upperPurple", priceTier: "premium", status: "available" },
    // ... Continue for all 30-32 seats in this row
    { id: "U1-30", row: "1", number: 30, x: 760, y: 320, width: 16, height: 16, section: "upperPurple", priceTier: "premium", status: "available" },
    
    // Upper Section Row 5 (Gold) - Example seats
    { id: "U5-1", row: "5", number: 1, x: 180, y: 240, width: 16, height: 16, section: "upperGold", priceTier: "standard", status: "available" },
    { id: "U5-2", row: "5", number: 2, x: 200, y: 240, width: 16, height: 16, section: "upperGold", priceTier: "standard", status: "available" },
    // ... Continue for all 30-32 seats in this row
    { id: "U5-30", row: "5", number: 30, x: 760, y: 240, width: 16, height: 16, section: "upperGold", priceTier: "standard", status: "available" },
    
    // === LOWER SECTION ===
    // Lower Section Row 1 (Purple) - Example seats with some sold seats
    { id: "L1-1", row: "1", number: 1, x: 180, y: 800, width: 16, height: 16, section: "lowerPurple", priceTier: "premium", status: "available" },
    // ... Middle seats
    { id: "L1-15", row: "1", number: 15, x: 440, y: 800, width: 16, height: 16, section: "lowerPurple", priceTier: "premium", status: "sold" },
    { id: "L1-16", row: "1", number: 16, x: 460, y: 800, width: 16, height: 16, section: "lowerPurple", priceTier: "premium", status: "sold" },
    { id: "L1-17", row: "1", number: 17, x: 480, y: 800, width: 16, height: 16, section: "lowerPurple", priceTier: "premium", status: "sold" },
    // ... Rest of the row
    { id: "L1-30", row: "1", number: 30, x: 760, y: 800, width: 16, height: 16, section: "lowerPurple", priceTier: "premium", status: "available" },
    
    // Lower Section Row 5 (Purple) - Example seats with some sold seats
    { id: "L5-1", row: "5", number: 1, x: 180, y: 700, width: 16, height: 16, section: "lowerPurple", priceTier: "premium", status: "available" },
    // ... Middle seats
    { id: "L5-15", row: "5", number: 15, x: 440, y: 700, width: 16, height: 16, section: "lowerPurple", priceTier: "premium", status: "available" },
    { id: "L5-16", row: "5", number: 16, x: 460, y: 700, width: 16, height: 16, section: "lowerPurple", priceTier: "premium", status: "sold" },
    { id: "L5-17", row: "5", number: 17, x: 480, y: 700, width: 16, height: 16, section: "lowerPurple", priceTier: "premium", status: "sold" },
    { id: "L5-18", row: "5", number: 18, x: 500, y: 700, width: 16, height: 16, section: "lowerPurple", priceTier: "premium", status: "sold" },
    // ... Rest of the row
    { id: "L5-30", row: "5", number: 30, x: 760, y: 700, width: 16, height: 16, section: "lowerPurple", priceTier: "premium", status: "available" },
    
    // Lower Section Row 9 (Gold) - Example seats with some sold seats
    { id: "L9-1", row: "9", number: 1, x: 180, y: 590, width: 16, height: 16, section: "lowerGold", priceTier: "standard", status: "available" },
    // ... Middle seats
    { id: "L9-15", row: "9", number: 15, x: 440, y: 590, width: 16, height: 16, section: "lowerGold", priceTier: "standard", status: "available" },
    { id: "L9-16", row: "9", number: 16, x: 460, y: 590, width: 16, height: 16, section: "lowerGold", priceTier: "standard", status: "sold" },
    { id: "L9-17", row: "9", number: 17, x: 480, y: 590, width: 16, height: 16, section: "lowerGold", priceTier: "standard", status: "sold" },
    { id: "L9-18", row: "9", number: 18, x: 500, y: 590, width: 16, height: 16, section: "lowerGold", priceTier: "standard", status: "sold" },
    // ... Rest of the row
    { id: "L9-30", row: "9", number: 30, x: 760, y: 590, width: 16, height: 16, section: "lowerGold", priceTier: "standard", status: "available" },
    
    // Lower Section Row 15 (Gold) - Example seats
    { id: "L15-1", row: "15", number: 1, x: 180, y: 440, width: 16, height: 16, section: "lowerGold", priceTier: "standard", status: "available" },
    { id: "L15-2", row: "15", number: 2, x: 200, y: 440, width: 16, height: 16, section: "lowerGold", priceTier: "standard", status: "available" },
    // ... Continue for all seats in this row
    { id: "L15-30", row: "15", number: 30, x: 760, y: 440, width: 16, height: 16, section: "lowerGold", priceTier: "standard", status: "available" }
  ]
};

// Function to generate the full seating chart data
export function generateFullVenueData() {
  const fullData = {...venueData};
  const seats = [];
  
  // Get resized seat dimensions based on screen size
  const getSeatDimensions = (isMobile = false) => {
    return {
      seatWidth: isMobile ? 21 : 25,    // Much bigger on mobile (140px)
      seatHeight: isMobile ? 21 : 25,   // Much bigger on mobile (140px)
      seatSpacing: isMobile ? 3 : 3,   // More spacing on mobile
      rowSpacing: isMobile ? 2 : 3     // More row spacing on mobile
    };
  };
  
  const dimensions = getSeatDimensions(false); // Default to desktop dimensions
  
  // Constants for seat generation
  const SEAT_WIDTH = dimensions.seatWidth;
  const SEAT_HEIGHT = dimensions.seatHeight;
  const SEAT_SPACING = dimensions.seatSpacing;
  const TOTAL_SEAT_WIDTH = SEAT_WIDTH + SEAT_SPACING;
  const ROW_SPACING = dimensions.rowSpacing;
  const START_X = 180;
  const CENTER_X = 540; // Center point for alignment
  const BASE_Y = 320; // Starting Y position for the top row
  
  // Upper section - 7 rows with variable lengths and chess configuration
  for (let row = 1; row <= 7; row++) {
    // Calculate number of seats per row - gradually increasing from 24 to 32
    const seatsInRow = Math.min(24 + Math.floor((row - 1) * (8 / 6)), 32);
    
    // Calculate y position with chess pattern offset
    const rowOffset = row % 2 === 0 ? SEAT_WIDTH / 2 : 0; // Staggered positioning for even rows
    const y = BASE_Y - (row - 1) * (SEAT_HEIGHT + ROW_SPACING);
    
    // Calculate starting x to center the row
    const rowWidth = seatsInRow * TOTAL_SEAT_WIDTH;
    const startX = CENTER_X - (rowWidth / 2) + rowOffset;
    
    const section = row <= 2 ? "upperPurple" : "upperGold";
    const priceTier = row <= 2 ? "premium" : "standard";
    
    for (let seatNum = 1; seatNum <= seatsInRow; seatNum++) {
      const x = startX + (seatNum - 1) * TOTAL_SEAT_WIDTH;
      seats.push({
        id: `U${row}-${seatNum}`,
        row: `${row}`,
        number: seatNum,
        x: x,
        y: y,
        width: SEAT_WIDTH,
        height: SEAT_HEIGHT,
        section: section,
        priceTier: priceTier,
        status: "available" // Default status
      });
    }
  }
  
  // Lower section - 15 rows with variable lengths and chess configuration
  const LOWER_BASE_Y = 800;
  for (let row = 1; row <= 15; row++) {
    // Calculate row length - first rows have 24 seats, gradually increasing to 32
    let seatsInRow = 32; // Default max
    
    if (row <= 8) { // First 8 rows grow from 24 to 32
      seatsInRow = Math.min(24 + Math.floor((row - 1) * (8 / 7)), 32);
    }
    
    // Calculate y position with chess pattern offset
    const rowOffset = row % 2 === 0 ? SEAT_WIDTH / 2 : 0; // Staggered positioning for even rows
    const y = LOWER_BASE_Y - (row - 1) * (SEAT_HEIGHT + ROW_SPACING);
    
    // Calculate starting x to center the row
    const rowWidth = seatsInRow * TOTAL_SEAT_WIDTH;
    const startX = CENTER_X - (rowWidth / 2) + rowOffset;
    
    const section = row <= 8 ? "lowerPurple" : "lowerGold";
    const priceTier = row <= 8 ? "premium" : "standard";
    
    for (let seatNum = 1; seatNum <= seatsInRow; seatNum++) {
      const x = startX + (seatNum - 1) * TOTAL_SEAT_WIDTH;
      
      // Add some sold seats as seen in the image
      let status = "available";
      
      // Keeping sold seats at similar positions
      if ((row === 1 && seatNum >= Math.floor(seatsInRow/2) - 1 && seatNum <= Math.floor(seatsInRow/2) + 1) ||
          (row === 5 && seatNum >= Math.floor(seatsInRow/2) - 0 && seatNum <= Math.floor(seatsInRow/2) + 2) ||
          (row === 9 && seatNum >= Math.floor(seatsInRow/2) - 0 && seatNum <= Math.floor(seatsInRow/2) + 2)) {
        status = "sold";
      }
      
      seats.push({
        id: `L${row}-${seatNum}`,
        row: `${row}`,
        number: seatNum,
        x: x,
        y: y,
        width: SEAT_WIDTH,
        height: SEAT_HEIGHT,
        section: section,
        priceTier: priceTier,
        status: status
      });
    }
  }
  
  fullData.seats = seats;
  return fullData;
}

// Export the full data with all seats generated
export const fullVenueData = generateFullVenueData();