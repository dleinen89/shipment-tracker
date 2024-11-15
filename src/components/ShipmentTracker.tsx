'use client'

import React, { useState } from 'react';
import { Search, Package, Truck, Calendar, MapPin } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ShipmentEvent {
  date: string;
  description: string;
}

interface ShipmentData {
  type: string;
  address: string;
  carrier: string;
  status: string;
  estimatedDelivery: string | null;
  events: ShipmentEvent[];
}

interface ShipmentDatabase {
  [key: string]: ShipmentData;
}

const ShipmentTracker = () => {
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [shipment, setShipment] = useState<ShipmentData | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const shipmentData: ShipmentDatabase = {
    REF789AU: {
      type: "Automotive Accessories",
      address: "1 Logistics Lane, Sydney NSW 2000",
      carrier: "TransExpress",
      status: "Delivered",
      estimatedDelivery: null,
      events: [
        { date: "16/10/2024, 08:00 AM", description: "Shipment picked up from ACME Distribution Pty Ltd, Brisbane QLD 4000" },
        { date: "16/10/2024, 08:00 PM", description: "Arrived at TransExpress Sydney Depot" },
        { date: "17/10/2024, 06:00 AM", description: "Departed TransExpress Sydney Depot for final delivery" },
        { date: "17/10/2024, 09:00 AM", description: "Delivered to Sydney Distribution Centre, 1 Logistics Lane, Sydney NSW 2000" }
      ]
    },
    REF456AU: {
      type: "Avgas IBC",
      address: "45 Learjet Lane, Melbourne VIC 3000",
      carrier: "DG Trans",
      status: "In transit",
      estimatedDelivery: "19/10/2024, 08:30 AM",
      events: [
        { date: "16/10/2024, 09:00 AM", description: "Pickup failed at ACME Distribution Pty Ltd due to load restraint issue" },
        { date: "16/10/2024, 10:30 AM", description: "Pickup rescheduled for 17/10/2024" },
        { date: "17/10/2024, 10:15 AM", description: "Shipment picked up from ACME Distribution Pty Ltd, Brisbane QLD 4000" },
        { date: "17/10/2024, 07:00 PM", description: "Departed DG Trans Brisbane Depot" }
      ]
    },
    REF123AU: {
      type: "Consumer Electronics",
      address: "45 Warehouse Road, Melbourne VIC 3000",
      carrier: "Oz Logistics",
      status: "Delivered",
      estimatedDelivery: null,
      events: [
        { date: "16/10/2024, 07:30 AM", description: "Shipment picked up from ACME Distribution Pty Ltd, Brisbane QLD 4000" },
        { date: "18/10/2024, 07:30 AM", description: "Arrived at Oz Logistics Melbourne Depot" },
        { date: "18/10/2024, 10:00 AM", description: "Out for delivery in Melbourne" },
        { date: "18/10/2024, 01:00 PM", description: "Delivered to 45 Warehouse Road, Melbourne VIC 3000" }
      ]
    }
  };

  const handleSearch = () => {
    setHasSearched(true);
    setShipment(shipmentData[referenceNumber] || null);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'In transit':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            Shipment Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => {
                setReferenceNumber(e.target.value.toUpperCase());
                setHasSearched(false);
              }}
              onKeyPress={handleKeyPress}
              placeholder="Enter reference number (e.g., REF123AU)"
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Track
            </button>
          </div>

          {hasSearched && !shipment && referenceNumber && (
            <Alert>
              <AlertDescription>
                No shipment found with reference number: {referenceNumber}
              </AlertDescription>
            </Alert>
          )}

          {shipment && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="font-semibold">Shipment Type</div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    {shipment.type}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold">Carrier</div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    {shipment.carrier}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold">Delivery Address</div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {shipment.address}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold">Status</div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(shipment.status)}`}>
                    {shipment.status}
                  </span>
                  {shipment.estimatedDelivery && (
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      Est. Delivery: {shipment.estimatedDelivery}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-4">Tracking History</h3>
                <div className="space-y-4">
                  {shipment.events.map((event, index) => (
                    <div key={index} className="flex gap-4 relative">
                      <div className="min-w-[180px] text-sm text-gray-600">
                        {event.date}
                      </div>
                      <div className="flex-1">
                        {event.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipmentTracker;