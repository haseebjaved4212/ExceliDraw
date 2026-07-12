export function getBoundingBox(element) {
  if (element.type === 'freedraw') {
    if (!element.points || element.points.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const pt of element.points) {
      if (pt[0] < minX) minX = pt[0];
      if (pt[0] > maxX) maxX = pt[0];
      if (pt[1] < minY) minY = pt[1];
      if (pt[1] > maxY) maxY = pt[1];
    }
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  } else {
    const ew = element.width || 0;
    const eh = element.height || 0;
    const minX = Math.min(element.x, element.x + ew);
    const maxX = Math.max(element.x, element.x + ew);
    const minY = Math.min(element.y, element.y + eh);
    const maxY = Math.max(element.y, element.y + eh);
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  }
}

export function rotatePoint(x, y, cx, cy, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const nx = (cos * (x - cx)) - (sin * (y - cy)) + cx;
  const ny = (sin * (x - cx)) + (cos * (y - cy)) + cy;
  return { x: nx, y: ny };
}

export function isPointInElement(px, py, element) {
  const box = getBoundingBox(element);
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  
  const angle = element.angle || 0;
  const unrotated = rotatePoint(px, py, cx, cy, -angle);
  
  const pad = 10;
  return unrotated.x >= box.x - pad &&
         unrotated.x <= box.x + box.width + pad &&
         unrotated.y >= box.y - pad &&
         unrotated.y <= box.y + box.height + pad;
}
