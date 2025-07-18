import type { Command } from "../types/Command";
import { help } from "./help";
import { uptime } from "./uptime";

export const commandList: Command[] = [help, uptime];
