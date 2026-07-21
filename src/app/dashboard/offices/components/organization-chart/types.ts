import type { Edge, Node } from "reactflow";
import type { Office } from "@/types/office";

export type OrganizationType =
  | "REGIONAL"
  | "PENRO"
  | "CENRO";

export interface OrganizationUnit {
  id: string;
  code: string;
  name: string;
  type: OrganizationType;
  description?: string | null;

  parentId: string | null;

  offices: Office[];
}

export interface OrganizationNodeData {
  organization: OrganizationUnit;

  officeCount: number;

  childrenCount: number;
}

export type OrganizationNode = Node<OrganizationNodeData>;

export type OrganizationEdge = Edge;