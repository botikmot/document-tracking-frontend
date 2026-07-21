import { MarkerType } from 'reactflow';

import { buildTree, TreeNode } from './builder';
import type {
  OrganizationNode,
  OrganizationEdge,
  OrganizationNodeData,
  OrganizationUnit,
} from './types';

const NODE_WIDTH = 300;
const NODE_HEIGHT = 170;

const HORIZONTAL_GAP = 80;
const VERTICAL_GAP = 340;

interface LayoutResult {
  nodes: OrganizationNode[];
  edges: OrganizationEdge[];
}

interface PositionResult {
  width: number;
}

function getSubtreeWidth(node: TreeNode): number {
  if (node.children.length === 0) {
    return NODE_WIDTH;
  }

  const childrenWidth = node.children.reduce(
    (sum, child) => sum + getSubtreeWidth(child),
    0,
  );

  const gaps =
    (node.children.length - 1) * HORIZONTAL_GAP;

  return Math.max(
    NODE_WIDTH,
    childrenWidth + gaps,
  );
}

function createLayout(
  node: TreeNode,
  depth: number,
  startX: number,
  nodes: OrganizationNode[],
  edges: OrganizationEdge[],
): PositionResult {
  const subtreeWidth =
    getSubtreeWidth(node);

  const centerX =
    startX + subtreeWidth / 2;

  const nodeData: OrganizationNodeData = {
    organization: node,
    officeCount: node.offices.length,
    childrenCount:
      node.children.length,
  };

  nodes.push({
    id: node.id,
    type: 'organization',

    position: {
      x: centerX - NODE_WIDTH / 2,
      y:
        depth *
        (NODE_HEIGHT +
          VERTICAL_GAP),
    },

    draggable: false,

    data: nodeData,
  });

  let childX = startX;

  node.children.forEach((child) => {
    const childWidth =
      getSubtreeWidth(child);

    createLayout(
      child,
      depth + 1,
      childX,
      nodes,
      edges,
    );

    edges.push({
      id: `${node.id}-${child.id}`,

      source: node.id,

      target: child.id,

      animated: true,

      type: 'smoothstep',

      markerEnd: {
        type:
          MarkerType.ArrowClosed,
      },
    });

    childX +=
      childWidth +
      HORIZONTAL_GAP;
  });

  return {
    width: subtreeWidth,
  };
}

export function buildOrganizationLayout(
  organizations: OrganizationUnit[],
): LayoutResult {
  const roots =
    buildTree(organizations);

  const nodes: OrganizationNode[] =
    [];

  const edges: OrganizationEdge[] =
    [];

  let startX = 0;

  roots.forEach((root) => {
    const width =
      getSubtreeWidth(root);

    createLayout(
      root,
      0,
      startX,
      nodes,
      edges,
    );

    startX +=
      width +
      HORIZONTAL_GAP;
  });

  return {
    nodes,
    edges,
  };
}