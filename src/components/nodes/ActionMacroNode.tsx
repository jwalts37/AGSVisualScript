import { Handle, Position, useReactFlow } from '@xyflow/react';
import { User } from 'lucide-react';

export function ActionMacroNode({ id, data }: { id: string, data: any }) {
  const { setNodes } = useReactFlow();

  const updateData = (key: string, value: string) => {
    setNodes((nds) => 
      nds.map((node) => {
        if (node.id === id) {
          node.data = { ...node.data, [key]: value };
        }
        return node;
      })
    );
  };

  const actionType = data.action || 'Say';

  return (
    <div className="bp-node">
      <Handle type="target" position={Position.Left} id="left" style={{ background: '#fff', width: '10px', height: '10px', borderRadius: '2px', border: '1px solid #000' }} />
      
      <div className="bp-header bp-header-action">
        <User size={14} color="#bfdbfe" />
        <span style={{ flex: 1, textTransform: 'uppercase' }}>Character Component</span>
      </div>
      
      <div className="bp-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <label style={{ fontSize: '12px', color: '#aaa' }}>Target</label>
           <select 
             value={data.character || 'cEgo'} 
             onChange={(e) => updateData('character', e.target.value)}
             className="nodrag bp-input"
           >
             <option value="cEgo">cEgo</option>
             <option value="cRoger">cRoger</option>
           </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <label style={{ fontSize: '12px', color: '#aaa' }}>Action</label>
           <select 
             value={actionType} 
             onChange={(e) => updateData('action', e.target.value)}
             className="nodrag bp-input"
           >
             <option value="Say">Say (Dialogue)</option>
             <option value="Walk">Walk To Coord</option>
           </select>
        </div>

        {actionType === 'Say' ? (
           <input 
             type="text" 
             value={data.text || ''} 
             onChange={(e) => updateData('text', e.target.value)}
             placeholder="Dialogue text..."
             className="nodrag bp-input"
             style={{ width: '100%', boxSizing: 'border-box', marginTop: '4px' }}
           />
        ) : (
           <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
             <input placeholder="X" type="number" value={data.x || 0} onChange={(e) => updateData('x', e.target.value)} className="nodrag bp-input" style={{ width: '50%' }} />
             <input placeholder="Y" type="number" value={data.y || 0} onChange={(e) => updateData('y', e.target.value)} className="nodrag bp-input" style={{ width: '50%' }} />
           </div>
        )}
      </div>

      <Handle type="source" position={Position.Right} id="right" style={{ background: '#fff', width: '10px', height: '10px', borderRadius: '2px', border: '1px solid #000' }} />
    </div>
  );
}
