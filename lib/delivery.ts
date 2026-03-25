export type DeliveryZone = {
  name: string;
  fee: number;
};

export const DELIVERY_ZONES: DeliveryZone[] = [
  { name: 'Bodija', fee: 800 },
  { name: 'UI / Agbowo', fee: 1000 },
  { name: 'Sango / Mokola / Ojoo', fee: 1500 },
  { name: 'Akobo / Basorun / Iwo-Road ', fee: 2000 },
  { name: 'Ring Road', fee: 3000 },
  { name: 'Challenge / Dugbe', fee: 2700 },
  { name: 'Outside Ibadan', fee: 5000 },
];