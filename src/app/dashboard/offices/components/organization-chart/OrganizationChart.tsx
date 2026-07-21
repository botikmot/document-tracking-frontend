'use client';

import { useMemo } from 'react';

import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlowProvider,
} from 'reactflow';

import 'reactflow/dist/style.css';

import {
  buildOrganizationLayout,
} from './layout';

import {
  OrganizationNode,
} from './';

import type {
  OrganizationUnit,
} from './types';

const nodeTypes = {
  organization: OrganizationNode,
};

interface Props {
  organizations: OrganizationUnit[];
}

function Chart({
  organizations,
}: Props) {

  const {
    nodes,
    edges,
  } = useMemo(() => {
    return buildOrganizationLayout(
      organizations,
    );
  }, [organizations]);

  return (
    <div className="h-[800px] w-full rounded-3xl border bg-white shadow-sm">

      <ReactFlow

        nodes={nodes}

        edges={edges}

        nodeTypes={nodeTypes}

        fitView

        fitViewOptions={{
          padding: 0.25,
        }}

        nodesDraggable={false}

        nodesConnectable={false}

        elementsSelectable

        proOptions={{
          hideAttribution: true,
        }}
      >

        <MiniMap
          pannable
          zoomable
        />

        <Controls
          position="bottom-right"
        />

        <Background
          gap={18}
          size={1}
          variant={
            BackgroundVariant.Dots
          }
        />

      </ReactFlow>

    </div>
  );
}

export default function OrganizationChart(
  props: Props,
) {
  return (
    <ReactFlowProvider>
      <Chart {...props} />
    </ReactFlowProvider>
  );
}