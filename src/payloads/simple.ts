import type { AutocompleteData, NS } from "@ns";

export async function main(ns: NS) {
  const target: string = (ns.args[0] as string) ?? ns.getHostname();

  const minSec = ns.getServerMinSecurityLevel(target);
  const maxMoney = ns.getServerMaxMoney(target);
  while (true) {
    const sec = ns.getServerSecurityLevel(target);
    const money = ns.getServerMoneyAvailable(target);

    if (sec > minSec * 1.1) await ns.weaken(target);
    else if (money < maxMoney * 0.9) await ns.grow(target);
    else await ns.hack(target);
  }
}

export function autocomplete(data: AutocompleteData, _args: NS["args"]) {
  return [...data.servers];
}
