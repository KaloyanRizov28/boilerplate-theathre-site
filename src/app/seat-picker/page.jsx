'use client';
import SeatMap from '../../components/seat-map/SeatMap';
import { fullVenueData } from '@/data/sampleVenueData';

export default function SeatPickerPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Seat Picker</h1>
      <SeatMap venueData={fullVenueData} />
    </div>
  );
}