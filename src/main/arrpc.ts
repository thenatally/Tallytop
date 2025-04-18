/*
 * Tallytop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2023 Vendicated and Vencord contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import Server from "arrpc";
import { IpcCommands } from "shared/IpcEvents";

import { sendRendererCommand } from "./ipcCommands";
import { Settings } from "./settings";

let server: any;

const inviteCodeRegex = /^(\w|-)+$/;

export async function initArRPC() {
    if (server) {
        console.log("[arRPC] Server already initialized, skipping init.");
        return;
    }

    if (!Settings.store.arRPC) {
        console.log("[arRPC] Disabled in settings, not starting.");
        return;
    }

    try {
        console.log("[arRPC] Starting arRPC server...");
        server = await new Server();
        console.log("[arRPC] arRPC server started successfully!");

        server.on("activity", (data: any) => {
            console.log("[arRPC] Received activity data:", data);
            sendRendererCommand(IpcCommands.RPC_ACTIVITY, JSON.stringify(data));
        });

        server.on("invite", async (invite: string, callback: (valid: boolean) => void) => {
            invite = String(invite);
            console.log("[arRPC] Received invite:", invite);
            if (!inviteCodeRegex.test(invite)) {
                console.warn("[arRPC] Invalid invite code format.");
                return callback(false);
            }

            try {
                await sendRendererCommand(IpcCommands.RPC_INVITE, invite).then(result => {
                    console.log("[arRPC] Invite sent to renderer, result:", result);
                    callback(result);
                });
            } catch (err) {
                console.error("[arRPC] Failed to handle invite:", err);
                callback(false);
            }
        });

        server.on("link", async (data: any, deepCallback: (valid: boolean) => void) => {
            console.log("[arRPC] Received deep link data:", data);
            try {
                await sendRendererCommand(IpcCommands.RPC_DEEP_LINK, data).then(result => {
                    console.log("[arRPC] Deep link sent to renderer, result:", result);
                    deepCallback(result);
                });
            } catch (err) {
                console.error("[arRPC] Failed to handle deep link:", err);
                deepCallback(false);
            }
        });
    } catch (e) {
        console.error("[arRPC] Failed to start arRPC server:", e);
    }
}

Settings.addChangeListener("arRPC", initArRPC);
