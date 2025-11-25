// findPath.js
import { graph } from "./mapGraph";

export function findPath(start, goal) {
  if (!start || !goal) return [];
  if (start === goal) return [start];

  const queue = [start];
  const visited = new Set([start]);
  const prev = {};

  while (queue.length) {
    const cur = queue.shift();
    if (cur === goal) {
      const path = [];
      let node = goal;
      while (node) {
        path.unshift(node);
        node = prev[node];
      }
      return path;
    }

    for (const next of graph[cur] || []) {
      if (!visited.has(next)) {
        visited.add(next);
        prev[next] = cur;
        queue.push(next);
      }
    }
  }
  return [];
}
