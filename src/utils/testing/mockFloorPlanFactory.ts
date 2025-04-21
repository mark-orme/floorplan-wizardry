
// For line 58, remove width from stroke:
const stroke = {
  id: `stroke-${i}`,
  points: [{ x: 10, y: 10 }, { x: 100, y: 100 }],
  type: 'line',
  color: '#000000',
  thickness: 2
  // width property removed
};

// For any FloorPlanMetadata object, ensure all required fields are present:
const metadata = {
  createdAt: now,
  updatedAt: now,
  paperSize: 'A4',
  level: 0,
  version: '1.0',
  author: 'User',
  dateCreated: now, // Add missing field
  lastModified: now, // Add missing field
  notes: ''
};
