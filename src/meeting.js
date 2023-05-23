import React, { useEffect, Fragment } from "react";

export default function Meeting({payload}) {
    useEffect(async () => {
        const { ZoomMtg } = await import("@zoomus/websdk");

        ZoomMtg.setZoomJSLib("https://source.zoom.us/lib", '/av');
        ZoomMtg.preLoadWasm();
        ZoomMtg.prepareWebSDK();
    });
    return (<h1>Meeting Will be here</h1>)
}