function findCircleLineIntersections(circleX, circleY, radius, slope, yIntercept) {
  // Circle: (x - circleX)^2 + (y - circleY)^2 = radius^2
  // Line: y = slope * x + yIntercept
  // Substitute the line equation into the circle's equation

  // (x - circleX)^2 + (slope * x + yIntercept - circleY)^2 - radius^2 = 0
  // Now we expand and simplify to get the quadratic equation ax^2 + bx + c = 0

  const a = 1 + slope ** 2;
  const b = -2 * circleX + 2 * slope * (yIntercept - circleY);
  const c = circleX ** 2 + (yIntercept - circleY) ** 2 - radius ** 2;

  // Solve the quadratic equation for x using the discriminant
  const discriminant = b ** 2 - 4 * a * c;

  // No real solutions means the line does not intersect the circle
  if (discriminant < 0) {
    return 'The line does not intersect the circle.';
  }

  // One solution means the line is tangent to the circle
  if (discriminant === 0) {
    const x = -b / (2 * a);
    const y = slope * x + yIntercept;
    return `The line is tangent to the circle at (${x}, ${y}).`;
  }

  // Two solutions means the line intersects the circle at two points (secant)
  const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
  const y1 = slope * x1 + yIntercept;
  const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
  const y2 = slope * x2 + yIntercept;
  
  return `The line intersects the circle at two points: (${x1}, ${y1}) and (${x2}, ${y2}).`;
}

// Example usage:
const circleX = 0; // X coordinate of circle's center
const circleY = 0; // Y coordinate of circle's center
const radius = 5; // Radius of the circle
const slope = 1; // Slope of the line
const yIntercept = 2; // Y-intercept of the line

console.log(findCircleLineIntersections(circleX, circleY, radius, slope, yIntercept));
