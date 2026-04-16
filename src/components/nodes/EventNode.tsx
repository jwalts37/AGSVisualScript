import { Handle, Position } from '@xyflow/react';
import { Zap } from 'lucide-react';

export function EventNode({ data }: { data: any }) {
  return (
    <div className="bp-node">
      <div className="bp-header bp-header-event">
        <Zap size={14} color="#fca5a5" />
        <span style={{ flex: 1, textTransform: 'uppercase' }}>Event</span>
        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', background: 'rgba(0,0,0,0.3)', padding: '2px 4px', borderRadius: '4px' }}>fn()</span>
      </div>
      
      <div className="bp-body">
        <div style={{ fontSize: '13px', padding: '4px 0' }}>
          {data.eventName || 'Unnamed Event'}
        </div>
      </div>
      
      {/* Event only has an output */}
      <Handle type="source" position={Position.Right} id="right" style={{ background: '#fff', width: '10px', height: '10px', borderRadius: '2px', border: '1px solid #000' }} />
    </div>
  );
}
