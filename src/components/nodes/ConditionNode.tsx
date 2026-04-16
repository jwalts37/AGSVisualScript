import { Handle, Position, useReactFlow } from '@xyflow/react';
import { GitBranch } from 'lucide-react';

export function ConditionNode({ id, data }: { id: string, data: any }) {
  const { setNodes } = useReactFlow();

  const updateData = (value: string) => {
    setNodes((nds) => 
      nds.map((node) => {
        if (node.id === id) {
          node.data = { ...node.data, condition: value };
        }
        return node;
      })
    );
  };

  return (
    <div className="bp-node">
      <Handle type="target" position={Position.Left} id="left" style={{ background: '#fff', width: '10px', height: '10px', borderRadius: '2px', border: '1px solid #000' }} />
      
      <div className="bp-header bp-header-condition">
        <GitBranch size={14} color="#fcd34d" />
        <span style={{ flex: 1, textTransform: 'uppercase' }}>Branch</span>
      </div>
      
      <div className="bp-body">
         <label style={{ fontSize: '11px', color: '#aaa', marginBottom: '-4px' }}>Condition Statement</label>
         <input 
           type="text" 
           value={data.condition || ''} 
           onChange={(e) => updateData(e.target.value)}
           placeholder="player.HasInventory(iKey)"
           className="nodrag bp-input"
           style={{ width: '100%', boxSizing: 'border-box' }}
         />

         <div style={{ position: 'relative', marginTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold' }}>
            <span></span> {/* spacer */}
            <div style={{ display: 'flex', gap: '20px' }}>
               <span style={{ marginRight: '10px', color: '#4ade80' }}>True</span>
               <span style={{ color: '#f87171' }}>False</span>
            </div>
         </div>
      </div>

      {/* Two outputs for branching */}
      <Handle type="source" position={Position.Right} id="true" style={{ top: '75%', background: '#4ade80', width: '12px', height: '12px', borderRadius: '6px', border: '2px solid #000' }} />
      <Handle type="source" position={Position.Right} id="false" style={{ top: '75%', right: '10px', background: '#f87171', width: '12px', height: '12px', borderRadius: '6px', border: '2px solid #000' }} />
    </div>
  );
}
