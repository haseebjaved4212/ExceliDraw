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

function sqr(x) { return x * x; }
function dist2(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y); }
function distToSegmentSquared(p, v, w) {
  let l2 = dist2(v, w);
  if (l2 === 0) return dist2(p, v);
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return dist2(p, { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) });
}
function distToSegment(px, py, vx, vy, wx, wy) { 
  return Math.sqrt(distToSegmentSquared({x: px, y: py}, {x: vx, y: vy}, {x: wx, y: wy})); 
}

export function isPointInElement(px, py, element) {
  const box = getBoundingBox(element);
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  
  const angle = element.angle || 0;
  const unrotated = rotatePoint(px, py, cx, cy, -angle);
  
  if (element.type === 'line' || element.type === 'arrow') {
    return distToSegment(unrotated.x, unrotated.y, element.x, element.y, element.x + element.width, element.y + element.height) < 10;
  }
  
  const pad = 10;
  return unrotated.x >= box.x - pad &&
         unrotated.x <= box.x + box.width + pad &&
         unrotated.y >= box.y - pad &&
         unrotated.y <= box.y + box.height + pad;
}
