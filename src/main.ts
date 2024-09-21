import type { NS } from "@ns";
import { Server } from "./lib/server";

export async function main(ns: NS): Promise<void> {
  const serverTree = new Server("home", null, ns);
  console.log("bean");

  const list = serverTree
    .traverse()

    .filter(
      ({ numPortsRequired, hasRootAccess }) => numPortsRequired <= 2 || hasRootAccess,
    );

  list.sort(({ maxMoney: a }, { maxMoney: b }) => b - a);

  list.forEach((srv) => {
    // const { name, maxMoney, growthParam, numPortsRequired } = srv;
    srv.nuke();

    const payload = "payloads/simple.js";

    srv.scp(payload);
    srv.exec(payload, "max", list[0].name);

    // ns.tprint(
    //   JSON.stringify({ name, maxMoney, growthParam, numPortsRequired }, null, 2),
    // );
  });

  // ns.tprint(JSON.stringify(serverTree, null, 2));
}
