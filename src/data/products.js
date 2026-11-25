// Product catalogue. Prices are integer cents, never floats.
export const CATEGORIES = ['Audio', 'Carry', 'Desk', 'Fitness'];

export const PRODUCTS = [
  { id: 'aero-headphones', name: 'Aero Wireless Headphones', category: 'Audio', price: 12900, stock: 12, hue: 232, description: 'Over-ear Bluetooth headphones with 30 hours of battery and a fold-flat case.', features: ['30 h battery', 'Bluetooth 5.3', 'Folds flat'] },
  { id: 'drift-speaker', name: 'Drift Bluetooth Speaker', category: 'Audio', price: 6900, stock: 4, hue: 200, description: 'Pocket speaker that survives rain and the beach. Pairs two units for stereo.', features: ['IP67 water resistant', '12 h battery', 'Stereo pairing'] },
  { id: 'nomad-backpack', name: 'Nomad Laptop Backpack', category: 'Carry', price: 7900, stock: 9, hue: 28, description: 'A 22 L backpack with a padded 16 inch laptop sleeve and a hidden passport pocket.', features: ['22 L', 'Fits 16" laptop', 'Water resistant fabric'] },
  { id: 'terra-bottle', name: 'Terra Water Bottle', category: 'Carry', price: 2400, stock: 30, hue: 150, description: 'Insulated steel bottle. Cold for 24 hours, hot for 12.', features: ['750 ml', 'Steel, BPA free', 'Dishwasher safe'] },
  { id: 'lumen-lamp', name: 'Lumen Desk Lamp', category: 'Desk', price: 4500, stock: 7, hue: 48, description: 'Dimmable LED desk lamp with three colour temperatures and a USB charging port.', features: ['3 colour temperatures', 'USB-A port', 'Touch dimmer'] },
  { id: 'orbit-keyboard', name: 'Orbit Mechanical Keyboard', category: 'Desk', price: 10900, stock: 0, hue: 270, description: 'Compact 75% mechanical keyboard with hot-swappable switches.', features: ['75% layout', 'Hot-swappable', 'USB-C and Bluetooth'] },
  { id: 'slate-stand', name: 'Slate Phone Stand', category: 'Desk', price: 1900, stock: 40, hue: 190, description: 'Weighted aluminium stand for phones and small tablets.', features: ['Aluminium', 'Non-slip base', 'Adjustable angle'] },
  { id: 'pulse-band', name: 'Pulse Fitness Band', category: 'Fitness', price: 5900, stock: 15, hue: 340, description: 'Tracks steps, sleep and heart rate. A week of battery per charge.', features: ['7 day battery', 'Heart rate', 'Sleep tracking'] },
];

export const getProduct = (id) => PRODUCTS.find((p) => p.id === id);
