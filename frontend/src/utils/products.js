// Placeholder image generator
export const getPlaceholderImage = (category) => {
  const colors = {
    'Steel & Iron': '%238B4513',
    'Machinery': '%23DC143C',
    'Tools': '%23FF8C00',
    'Electrical': '%23FFD700',
    'Plumbing': '%234169E1',
    'Construction': '%23A9A9A9'
  };
  const color = colors[category] || '%23808080';
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='${color}' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='16' fill='white' text-anchor='middle' dy='.3em' font-weight='bold'%3E${category}%3C/text%3E%3C/svg%3E`;
};

// All products data - 22 products across all categories
export const allProducts = [
  // Steel & Iron (5)
  { id: 1, name: 'Industrial Steel Beams', price: 5000, description: 'High-grade structural steel beams for construction. 10m length.', rating: 4.5, reviews: 120, image: getPlaceholderImage('Steel & Iron'), vendor: 'Steel Enterprises', category: 'Steel & Iron', inStock: true, moq: 5, delivery: '3-5 days' },
  { id: 7, name: 'Carbon Steel Rods', price: 3500, description: 'High tensile carbon steel rods. Excellent for manufacturing.', rating: 4.6, reviews: 89, image: getPlaceholderImage('Steel & Iron'), vendor: 'Steel Corp', category: 'Steel & Iron', inStock: true, moq: 2, delivery: '3-4 days' },
  { id: 8, name: 'Galvanized Steel Sheet', price: 4200, description: 'Corrosion-resistant galvanized steel sheets. 2mm thickness.', rating: 4.3, reviews: 145, image: getPlaceholderImage('Steel & Iron'), vendor: 'Sheet Steel Ltd', category: 'Steel & Iron', inStock: true, moq: 3, delivery: '5-7 days' },
  { id: 9, name: 'Iron Angle Sections', price: 2800, description: 'Structural iron angle sections for framing. 50x50mm.', rating: 4.2, reviews: 102, image: getPlaceholderImage('Steel & Iron'), vendor: 'Iron Works', category: 'Steel & Iron', inStock: true, moq: 4, delivery: '2-3 days' },
  { id: 5, name: 'Stainless Steel Pipes Bundle', price: 12000, description: 'Grade 304 stainless steel pipes. 50mm diameter, 6m length.', rating: 4.4, reviews: 156, image: getPlaceholderImage('Steel & Iron'), vendor: 'Pipe Industries', category: 'Steel & Iron', inStock: true, moq: 1, delivery: '4-6 days' },
  
  // Machinery (5)
  { id: 2, name: 'Heavy Duty Hydraulic Press', price: 150000, description: '100-ton hydraulic press machine. Industrial grade.', rating: 4.8, reviews: 85, image: getPlaceholderImage('Machinery'), vendor: 'Industrial Works', category: 'Machinery', inStock: true, moq: 1, delivery: '7-10 days' },
  { id: 10, name: 'CNC Milling Machine', price: 280000, description: 'Precision 3-axis CNC milling machine. Fully automated.', rating: 4.9, reviews: 67, image: getPlaceholderImage('Machinery'), vendor: 'CNC Industries', category: 'Machinery', inStock: true, moq: 1, delivery: '14-21 days' },
  { id: 11, name: 'Industrial Conveyor Belt', price: 85000, description: 'Heavy-duty rubber conveyor belt system. 5m length.', rating: 4.5, reviews: 93, image: getPlaceholderImage('Machinery'), vendor: 'Conveyor Tech', category: 'Machinery', inStock: true, moq: 1, delivery: '10-12 days' },
  { id: 12, name: 'Industrial Pump System', price: 45000, description: 'Centrifugal pump for water and liquid transfer. 50HP.', rating: 4.6, reviews: 78, image: getPlaceholderImage('Machinery'), vendor: 'Pump Solutions', category: 'Machinery', inStock: true, moq: 1, delivery: '5-7 days' },
  { id: 13, name: 'Air Compressor Industrial', price: 65000, description: '15KW rotary screw air compressor. 150L tank.', rating: 4.7, reviews: 112, image: getPlaceholderImage('Machinery'), vendor: 'Air Systems', category: 'Machinery', inStock: true, moq: 1, delivery: '8-10 days' },
  
  // Tools (4)
  { id: 3, name: 'Professional Tools Set', price: 8500, description: '120-piece complete tool set for industrial work.', rating: 4.3, reviews: 200, image: getPlaceholderImage('Tools'), vendor: 'Tool Masters', category: 'Tools', inStock: true, moq: 1, delivery: '1-2 days' },
  { id: 14, name: 'Digital Multimeter Pro', price: 2500, description: 'High-precision digital multimeter.', rating: 4.4, reviews: 178, image: getPlaceholderImage('Tools'), vendor: 'Test Instruments', category: 'Tools', inStock: true, moq: 1, delivery: '1-2 days' },
  { id: 15, name: 'Power Drill Set', price: 6200, description: '20V cordless power drill with 30 accessories.', rating: 4.5, reviews: 267, image: getPlaceholderImage('Tools'), vendor: 'Power Tools Co', category: 'Tools', inStock: true, moq: 1, delivery: '2-3 days' },
  { id: 16, name: 'Angle Grinder Professional', price: 3800, description: '100mm angle grinder with safety guards. 850W.', rating: 4.6, reviews: 145, image: getPlaceholderImage('Tools'), vendor: 'Tool Factory', category: 'Tools', inStock: true, moq: 1, delivery: '2-3 days' },
  
  // Electrical (4)
  { id: 4, name: 'Industrial Electrical Equipment', price: 25000, description: '50KW 3-phase transformer with cooling system.', rating: 4.6, reviews: 95, image: getPlaceholderImage('Electrical'), vendor: 'Power Solutions', category: 'Electrical', inStock: true, moq: 1, delivery: '5-7 days' },
  { id: 6, name: 'Electric Motor 5HP', price: 18000, description: '5 horsepower 3-phase industrial motor. 2800 RPM.', rating: 4.7, reviews: 142, image: getPlaceholderImage('Electrical'), vendor: 'Motor Solutions', category: 'Electrical', inStock: true, moq: 1, delivery: '2-3 days' },
  { id: 17, name: 'Solar Panel System 5KW', price: 185000, description: 'Complete 5KW solar panel system with inverter. Grid-tied.', rating: 4.8, reviews: 198, image: getPlaceholderImage('Electrical'), vendor: 'Solar Energy Ltd', category: 'Electrical', inStock: true, moq: 1, delivery: '10-15 days' },
  { id: 18, name: 'Industrial LED Lighting', price: 12000, description: '200W LED high-bay light. 24000 lumens. 5000K.', rating: 4.5, reviews: 112, image: getPlaceholderImage('Electrical'), vendor: 'Light Solutions', category: 'Electrical', inStock: true, moq: 2, delivery: '3-5 days' },
  
  // Plumbing (2)
  { id: 19, name: 'PVC Pipe Bundle', price: 5500, description: 'Heavy-duty PVC pipes. 50mm diameter, 6m length.', rating: 4.3, reviews: 134, image: getPlaceholderImage('Plumbing'), vendor: 'Plumbing Works', category: 'Plumbing', inStock: true, moq: 1, delivery: '2-3 days' },
  { id: 20, name: 'Industrial Water Tank', price: 32000, description: '1000L stainless steel water tank. Food-grade.', rating: 4.7, reviews: 87, image: getPlaceholderImage('Plumbing'), vendor: 'Tank Industries', category: 'Plumbing', inStock: true, moq: 1, delivery: '7-10 days' },
  
  // Construction (2)
  { id: 21, name: 'Concrete Mixing Machine', price: 42000, description: '500L concrete mixer. Electric powered, drum type.', rating: 4.4, reviews: 156, image: getPlaceholderImage('Construction'), vendor: 'Construction Equipment', category: 'Construction', inStock: true, moq: 1, delivery: '5-7 days' },
  { id: 22, name: 'Industrial Scaffolding System', price: 28000, description: 'Modular metal scaffolding system. Frame size 1.2x2.5m.', rating: 4.6, reviews: 98, image: getPlaceholderImage('Construction'), vendor: 'Scaffold Pro', category: 'Construction', inStock: true, moq: 1, delivery: '3-5 days' }
];

// Get products by vendor
export const getProductsByVendor = (vendorName) => {
  return allProducts.filter(p => p.vendor === vendorName);
};

// Get products by category
export const getProductsByCategory = (categoryName) => {
  return allProducts.filter(p => p.category === categoryName);
};

// Get unique vendors
export const getUniqueVendors = () => {
  const vendors = new Set(allProducts.map(p => p.vendor));
  return Array.from(vendors);
};

// Get unique categories
export const getUniqueCategories = () => {
  const categories = new Set(allProducts.map(p => p.category));
  return Array.from(categories);
};
