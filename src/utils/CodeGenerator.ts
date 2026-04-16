import { type Node, type Edge } from '@xyflow/react';

export const generateAgsScript = (nodes: Node[], edges: Edge[], scopeName: string): string => {
  let code = `// --- Generated AGS Script for ${scopeName} ---\n\n`;

  // Find all Event nodes (entry points)
  const eventNodes = nodes.filter(n => n.type === 'eventNode');

  eventNodes.forEach(eventNode => {
    // Basic function header
    const eventName = eventNode.data.eventName || 'UnnamedEvent';
    code += `function ${eventName}() {\n`;

    // Traverse
    let currentNodeId: string | null = eventNode.id;

    // To prevent infinite loops in bad graphs
    const visited = new Set<string>();

    while (currentNodeId) {
      if (visited.has(currentNodeId)) {
         code += `  // Error: Cycle detected!\n`;
         break;
      }
      visited.add(currentNodeId);

      // We handle the node's output based on type (skipping the event node itself for the body)
      if (currentNodeId !== eventNode.id) {
        const node = nodes.find(n => n.id === currentNodeId);
        if (node) {
          if (node.type === 'actionMacroNode') {
            const char = node.data.character || 'cEgo';
            const action = node.data.action || 'Say';
            
            if (action === 'Say') {
               const text = node.data.text || '...';
               code += `  ${char}.Say("${text}");\n`;
            } else if (action === 'Walk') {
               const x = node.data.x || 0;
               const y = node.data.y || 0;
               code += `  ${char}.Walk(${x}, ${y}, eBlock, eWalkableAreas);\n`;
            }
          } else if (node.type === 'conditionNode') {
             const condition = node.data.condition || 'player.HasInventory(iKey)';
             code += `  if (${condition}) {\n    // Node Branching not fully implemented in v1 parser\n  }\n`;
          }
        }
      }

      // Find the next edge out. For Action nodes, there is only one default output.
      // Doing simple linear traversal for phase 1.
      const outgoingEdge = edges.find(e => e.source === currentNodeId && e.sourceHandle !== 'false');
      
      if (outgoingEdge) {
        currentNodeId = outgoingEdge.target;
      } else {
        currentNodeId = null;
      }
    }

    code += '}\n\n';
  });

  if (eventNodes.length === 0) {
     code += '// No events found in this scope.\n';
  }

  return code;
};
