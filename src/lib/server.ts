// Just an FYI to anyone reading this file: I have never used js classes before,
// just raw objects with TS types, I just wanted some stronger typing this time

import type { NS, RunOptions, ScriptArg } from "@ns";

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
  readonly numPortsRequired: number;

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

    this.ram = ns.getServerMaxRam(name);
    this.numPortsRequired = ns.getServerNumPortsRequired(name);

    this.maxMoney = ns.getServerMaxMoney(name);
    this.minSecurity = ns.getServerMinSecurityLevel(name);
    this.growthParam = ns.getServerGrowth(name);

    this.#ns = ns;
    this.children = this.#queryChildren();
  }

  #queryChildren(): Array<Server> {
    const childNames = this.#ns.scan(this.name);
    return childNames
      .filter((name) => name !== this.parentName)
      .map((name) => new Server(name, this.name, this.#ns));
  }

  traverse(): Array<Server> {
    let thisLevel: Array<Server> = [this];
    let nextLevel: Array<Server>;
    const out = [];

    while (thisLevel.length > 0) {
      nextLevel = thisLevel.flatMap(({ children }) => children);
      out.push(...thisLevel);
      thisLevel = nextLevel;
      nextLevel = [];
    }

    return [this, ...this.children.flatMap((child) => child.traverse())];
  }

  nuke() {
    if (this.#ns.fileExists("BruteSSH.exe")) this.#ns.brutessh(this.name);
    if (this.#ns.fileExists("FTPCrack.exe")) this.#ns.ftpcrack(this.name);
    if (this.#ns.fileExists("RelaySMTP.exe")) this.#ns.relaysmtp(this.name);
    if (this.#ns.fileExists("HTTPWorm.exe")) this.#ns.httpworm(this.name);
    if (this.#ns.fileExists("SQLInject.exe")) this.#ns.sqlinject(this.name);
    this.#ns.nuke(this.name);
  }

  scp(files: string | Array<string>, source?: string) {
    this.#ns.scp(files, this.name, source);
  }

  exec(
    script: string,
    opts: "max" | number | RunOptions,
    ...args: Array<ScriptArg>
  ): number {
    const scriptRam = this.#ns.getScriptRam(script);
    if (scriptRam > this.freeRam) return -1;
    if (opts === "max")
      return this.#ns.exec(
        script,
        this.name,
        Math.floor(this.freeRam / scriptRam),
        ...args,
      );
    else return this.#ns.exec(script, this.name, opts, ...args);
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
