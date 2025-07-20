import type { Command } from "../types/Command";
import { help } from "./help";
import { ping } from "./ping";
import { uptime } from "./uptime";

export const commandList: Command[] = [help, uptime, ping];
