import type { NS } from "@ns";
import { Server } from "./lib/server";

export async function main(ns: NS): Promise<void> {
  const serverTree = new Server("home", null, ns);
  console.log("bean");

  const list = serverTree
    .traverse()
    .filter(
      ({ numPortsRequired, hasRootAccess }) => numPortsRequired <= 3 || hasRootAccess,
    );

  list.sort(({ maxMoney: a }, { maxMoney: b }) => b - a);
  const hackingLevel = ns.getHackingLevel();
  const target = list.find((srv) => srv.requiredHackingLevel <= hackingLevel);
  if (!target) throw new Error("cannot find suitable target");

  list.forEach((srv) => {
    // const { name, maxMoney, growthParam, numPortsRequired, ram } = srv;
    // ns.tprint(
    //   JSON.stringify({ name, ram, maxMoney, growthParam, numPortsRequired }, null, 2),
    // );

    srv.nuke();

    const payload = "payloads/simple.js";

    srv.scp(payload);
    srv.exec(payload, "max", target.name);
  });

  // ns.tprint(JSON.stringify(serverTree, null, 2));
}
