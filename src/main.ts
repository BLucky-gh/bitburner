import type { NS } from "@ns";
import { Server } from "./lib/tree";

export async function main(ns: NS): Promise<void> {
  const serverTree = new Server("home", null, ns);

  ns.tprint(serverTree.flattenTree().map(({ name }) => name));

  // ns.tprint(JSON.stringify(serverTree, null, 2));
}
