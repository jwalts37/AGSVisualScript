import { useCallback, useState, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  BackgroundVariant,
  Panel,
  ReactFlowProvider
} from '@xyflow/react';
import { Play, FileCode, Folder, Plus, Zap, FolderOpen } from 'lucide-react';
import { generateAgsScript } from './utils/CodeGenerator';
import { open as openDialog } from '@tauri-apps/plugin-dialog';

// Import our custom nodes and edges
import { EventNode } from './components/nodes/EventNode';
import { ActionMacroNode } from './components/nodes/ActionMacroNode';
import { ConditionNode } from './components/nodes/ConditionNode';
import { ElectricEdge } from './components/edges/ElectricEdge';

const initialNodes: Node[] = [
  { id: '1', type: 'eventNode', position: { x: 50, y: 150 }, data: { eventName: 'hDoor_Interact' } },
  { id: '2', type: 'actionMacroNode', position: { x: 300, y: 120 }, data: { action: 'Walk', character: 'cEgo', x: 150, y: 120 } },
  { id: '3', type: 'actionMacroNode', position: { x: 550, y: 120 }, data: { action: 'Say', character: 'cEgo', text: 'It is locked.' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', type: 'electric' },
  { id: 'e2-3', source: '2', target: '3', type: 'electric' },
];

export default function App() {
  const [activeScope, setActiveScope] = useState<string>('Room 1');
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [edgeStyle, setEdgeStyle] = useState<'default' | 'electric'>('electric');

  // Register custom node and edge types
  const nodeTypes = useMemo(() => ({
    eventNode: EventNode,
    actionMacroNode: ActionMacroNode,
    conditionNode: ConditionNode
  }), []);

  const edgeTypes = useMemo(() => ({
    electric: ElectricEdge
  }), []);

  const onConnect = useCallback(
    (params: Connection | Edge) => {
       const newEdge = { 
         ...params, 
         type: edgeStyle === 'electric' ? 'electric' : 'default', 
         animated: edgeStyle === 'default' 
       };
       setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, edgeStyle]
  );

  const toggleEdgeStyle = () => {
    const newStyle = edgeStyle === 'default' ? 'electric' : 'default';
    setEdgeStyle(newStyle);
    setEdges(eds => eds.map(e => ({
       ...e,
       type: newStyle === 'electric' ? 'electric' : 'default',
       animated: newStyle === 'default'
    })));
  };

  const handleOpenProject = async () => {
    const isTauri = '__TAURI_INTERNALS__' in window;
    if (isTauri) {
      try {
        const selected = await openDialog({
          directory: true,
          multiple: false,
          title: 'Select AGS Game Project Folder'
        });
        if (selected) {
           alert(`You selected folder: ${selected}\n\n(Parsing logic coming next phase!)`);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("Opening a local folder requires running the desktop .exe via 'npm run tauri dev'!");
    }
  };

  const handleCompile = () => {
    const code = generateAgsScript(nodes, edges, activeScope);
    setGeneratedCode(code);
  };

  const handleAddNode = (type: string) => {
    const newNode: Node = {
      id: `${Date.now()}`,
      type,
      position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
      data: type === 'eventNode' ? { eventName: 'NewEvent' } : 
            type === 'actionMacroNode' ? { action: 'Say', character: 'cEgo' } : 
            { condition: 'player.HasInventory(iItem)' }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <div style={{ padding: '12px 20px', background: '#1e1e24', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileCode size={20} color="#8b5cf6" />
            <span style={{ fontWeight: 'bold', letterSpacing: '1px' }}>AGS Visual Scripter</span>
         </div>
         
         <div style={{ display: 'flex', gap: '12px' }}>
           <button 
              onClick={handleOpenProject}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', 
                backgroundColor: '#3b3d45', color: '#fff', border: '1px solid #555', borderRadius: '6px', 
                fontWeight: 'bold', cursor: 'pointer', fontSize: '12px'
              }}>
              <FolderOpen size={14} /> Open AGS Project
           </button>

           <button 
              onClick={toggleEdgeStyle}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', 
                backgroundColor: 'transparent', color: '#aaddff', border: '1px solid #3b82f6', borderRadius: '6px', 
                fontWeight: 'bold', cursor: 'pointer', fontSize: '12px'
              }}>
              <Zap size={14} color={edgeStyle === 'electric' ? '#fcd34d' : '#888'} /> 
              {edgeStyle === 'electric' ? 'Electric Flow' : 'Standard Lines'}
           </button>

           <button 
              onClick={handleCompile}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', 
                backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', 
                fontWeight: 'bold', cursor: 'pointer', fontSize: '13px'
              }}>
              <Play size={14} /> Export Game
           </button>
         </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar (Project Explorer) */}
        <div style={{ width: '250px', background: '#121215', borderRight: '1px solid #333', padding: '20px', display: 'flex', flexDirection: 'column' }}>
           <h3 style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}><Folder size={14} /> ROOMS</h3>
           <div 
             onClick={() => setActiveScope('Room 1')}
             style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', background: activeScope === 'Room 1' ? '#2563eb' : 'transparent', marginBottom: '4px' }}>
             room1.crm
           </div>
           <div 
             onClick={() => setActiveScope('Room 2')}
             style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', background: activeScope === 'Room 2' ? '#2563eb' : 'transparent' }}>
             room2.crm
           </div>

           <h3 style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', marginTop: '30px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}><Folder size={14} /> SCRIPTS</h3>
           <div 
             onClick={() => setActiveScope('GlobalScript')}
             style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', background: activeScope === 'GlobalScript' ? '#2563eb' : 'transparent' }}>
             GlobalScript.asc
           </div>
        </div>

        {/* Main Canvas Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              colorMode="dark"
              fitView
              minZoom={0.2}
            >
              <Controls />
              <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#3b3d45" />

              {/* Node Palette Panel */}
              <Panel position="top-left" style={{ background: 'rgba(20,20,25,0.9)', padding: '10px', borderRadius: '8px', border: '1px solid #333', display: 'flex', gap: '8px' }}>
                <button onClick={() => handleAddNode('eventNode')} style={{ background: '#8b5cf6', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Plus size={12}/> Event
                </button>
                <button onClick={() => handleAddNode('actionMacroNode')} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Plus size={12}/> Action
                </button>
                <button onClick={() => handleAddNode('conditionNode')} style={{ background: '#d97706', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Plus size={12}/> Condition
                </button>
              </Panel>
            </ReactFlow>
          </ReactFlowProvider>

          {/* Code Output Viewer (Bottom Panel) */}
          {generatedCode && (
            <div style={{ height: '250px', background: '#0a0a0c', borderTop: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '8px 16px', background: '#1a1a1f', borderBottom: '1px solid #333', fontSize: '12px', fontWeight: 'bold' }}>
                Compilation Output ({activeScope})
              </div>
              <pre style={{ margin: 0, padding: '16px', color: '#aaddff', overflowY: 'auto', fontSize: '13px', flex: 1 }}>
                <code>{generatedCode}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
