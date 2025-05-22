import React, { useEffect, useState } from 'react'

type DynamicSVGProps = {
    path: string,
    scaling: "maxfit" | "minfit",
    fitDims: {
        width: number,
        height: number
    }
}

type SVGInfo = {
    source: string;
    width: number;
    height: number;
}

export default function DynamicSVG(props: DynamicSVGProps) {
    const [svgInfo, setSVGInfo] = useState<SVGInfo | undefined>();

    useEffect(() => {
        (async () => {
            const res = await fetch(`\\api\\images\\${props.path}`);
            const rawSVG = await res.text();
            const viewBox = rawSVG.substring(rawSVG.indexOf("viewBox")).split("\"")[1].split(" ").map(x => parseFloat(x));

            const width = viewBox[2];
            const height = viewBox[3];

            const scale =  props.scaling == "maxfit" ?
                Math.max(props.fitDims.width / width, props.fitDims.height / height) :
                Math.min(props.fitDims.width / width, props.fitDims.height / height);

            setSVGInfo({
                source: rawSVG,
                width: width * scale,
                height: height * scale
            });
        })();
    }, [props]);

    return (
        <div
            dangerouslySetInnerHTML={{ __html: svgInfo ? svgInfo.source : "" }}
            style={{
                width: svgInfo ? svgInfo.width : 0,
                height: svgInfo ? svgInfo.height : 0
            }}
        />
    )
}
