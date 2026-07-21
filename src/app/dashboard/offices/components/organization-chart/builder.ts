import type { OrganizationUnit } from "./types";

export interface TreeNode extends OrganizationUnit {
  children: TreeNode[];
}

export function buildTree(
  organizations: OrganizationUnit[]
): TreeNode[] {
  const map = new Map<string, TreeNode>();

  organizations.forEach((org) => {
    map.set(org.id, {
      ...org,
      children: [],
    });
  });

  const roots: TreeNode[] = [];

  map.forEach((org) => {
    if (!org.parentId) {
      roots.push(org);
      return;
    }

    const parent = map.get(org.parentId);

    if (parent) {
      parent.children.push(org);
    }
  });

  return roots;
}