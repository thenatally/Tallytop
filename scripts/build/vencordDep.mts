/*
 * Tallytop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2023 Vendicated and Vencord contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { globalExternalsWithRegExp } from "@fal-works/esbuild-plugin-global-externals";

const names = {
    webpack: "Tallycord.Webpack",
    "webpack/common": "Tallycord.Webpack.Common",
    utils: "Tallycord.Util",
    api: "Tallycord.Api",
    "api/settings": "Tallycord",
    components: "Tallycord.Components"
};

export default globalExternalsWithRegExp({
    getModuleInfo(modulePath) {
        const path = modulePath.replace("@vencord/types/", "");
        let varName = names[path];
        if (!varName) {
            const altMapping = names[path.split("/")[0]];
            if (!altMapping) throw new Error("Unknown module path: " + modulePath);

            varName =
                altMapping +
                "." +
                // @ts-ignore
                path.split("/")[1].replaceAll("/", ".");
        }
        return {
            varName,
            type: "cjs"
        };
    },
    modulePathFilter: /^@vencord\/types.+$/
});
