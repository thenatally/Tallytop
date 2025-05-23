/*
 * Tallytop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2023 Vendicated and Vencord contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Switch, useState } from "@vencord/types/webpack/common";

import { SettingsComponent } from "./Settings";

export const AutoStartToggle: SettingsComponent = () => {
    const [autoStartEnabled, setAutoStartEnabled] = useState(TallytopNative.autostart.isEnabled());

    return (
        <Switch
            value={autoStartEnabled}
            onChange={async v => {
                await TallytopNative.autostart[v ? "enable" : "disable"]();
                setAutoStartEnabled(v);
            }}
            note="Automatically start Tallytop on computer start-up"
        >
            Start With System
        </Switch>
    );
};
