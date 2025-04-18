/*
 * Tallytop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2023 Vendicated and Vencord contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

declare global {
    export var TallytopNative: typeof import("preload/TallytopNative").TallytopNative;
    export var Tallytop: typeof import("renderer/index");
    export var TallytopPatchGlobals: any;

    export var IS_DEV: boolean;
}

export {};
