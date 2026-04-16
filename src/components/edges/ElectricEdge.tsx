import { BaseEdge, type EdgeProps, getBezierPath } from '@xyflow/react';

export function ElectricEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  style = {},
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      {/* Outer blurred glow */}
      <path
        d={edgePath}
        style={{
          stroke: '#60a5fa', // Bright blue glow
          strokeWidth: 8,
          fill: 'none',
          strokeOpacity: 0.6,
          filter: 'blur(4px)',
          animation: 'pulseGlow 1.5s infinite alternate',
          ...style,
        }}
      />
      {/* Inner solid wire */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: '#bfdbfe', // Core wire color
          strokeWidth: 2,
          ...style,
        }}
      />
      
      {/* Animating energy pulse dot */}
      <circle r="3" fill="#ffffff" filter="blur(1px)">
        <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
      </circle>
    </>
  );
}
