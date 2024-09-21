// Just an FYI to anyone reading this file: I have never used js classes before,
// just raw objects with TS types, I just wanted some stronger typing this time

import type { NS } from "@ns";

export class ServerTree {
  root: Server;
  constructor(root: Server) {
    this.root = root;
  }
}

export class Server {
  readonly name: string;
  readonly parentName: string | null;
  readonly ram: number;
  readonly maxMoney: number;
  readonly minSecurity: number;
  readonly growthParam: number;
  readonly children: Array<Server>;
  readonly #ns: NS;

  get money(): number {
    return this.#ns.getServerMoneyAvailable(this.name);
  }
  get securityLevel(): number {
    return this.#ns.getServerSecurityLevel(this.name);
  }

  get growTime(): number {
    return this.#ns.getGrowTime(this.name);
  }
  get hackTime(): number {
    return this.#ns.getHackTime(this.name);
  }
  get weakenTime(): number {
    return this.#ns.getWeakenTime(this.name);
  }

  get usedRam(): number {
    return this.#ns.getServerUsedRam(this.name);
  }
  get freeRam(): number {
    return this.ram - this.usedRam;
  }

  constructor(name: string, parentName: string | null, ns: NS) {
    this.name = name;
    this.parentName = parentName;
    this.#ns = ns;

    this.growthParam = this.#ns.getServerGrowth(name);

    this.ram = this.#ns.getServerMaxRam(name);

    this.maxMoney = ns.getServerMaxMoney(name);
    this.minSecurity = ns.getServerMinSecurityLevel(name);

    this.children = this.#queryChildren();
  }

  #queryChildren(): Array<Server> {
    const childNames = this.#ns.scan(this.name);
    return childNames
      .filter((name) => name !== this.parentName)
      .map((name) => new Server(name, this.name, this.#ns));
  }

  flattenTree(): Array<Server> {
    return [this, ...this.children.flatMap((child) => child.flattenTree())];
  }

  toJSON() {
    const {
      name,
      parentName,
      maxMoney,
      minSecurity,
      children,
      money,
      securityLevel,
      growTime,
      hackTime,
      weakenTime,
      growthParam,
      ram,
    } = this;
    return {
      name,
      parentName,
      ram,
      maxMoney,
      money,
      growthParam,
      minSecurity,
      securityLevel,
      growTime,
      hackTime,
      weakenTime,
      children,
    };
  }
}
