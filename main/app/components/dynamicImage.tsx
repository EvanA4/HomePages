// 'use client';

// import { getImageData } from '@/public/utils/imageUtils';
// import { DBImage } from '@/types/types';
// import Image from 'next/image';
// import { useEffect, useRef, useState } from 'react';

// type DynamicImageProps = {
//     path: string;
// 	scaling: "bigfit" | "smallfit" | "default";
// 	fitDims: {
//         width: number;
//         height: number;
//     }
// 	alt: string;
// 	unoptimized?: boolean;
// 	priority?: boolean;
// 	draggable?: boolean;
// }

// export default function DynamicImage(props: DynamicImageProps) {
//     const [imageData, setImageData] = useState<DBImage | undefined>();
//     const [imageScale, setImageScale] = useState<{ width?: number, height?: number } | undefined>();
//     const typeRef = useRef("");
    
    
//     async function handleNonSVG(img: DBImage) {
//         if (props.scaling == "default") {
//             // default scaling
//             setImageScale({
//                 width: img.width!,
//                 height: img.height!,
//             });
            
//         } else {
//             // smallfit and bigfit
//             if (!props.fitDims) {
//                 throw new Error("a non-default scaling requires fit dimensions");
//             }
            
//             const useWidth = props.scaling == "bigfit" ? 
//             props.fitDims.width / img.width! > props.fitDims.height / img.height! :
//             props.fitDims.width / img.width! < props.fitDims.height / img.height!;
//             const scale = useWidth ?
//             props.fitDims.width / img.width! :
//             props.fitDims.height / img.height!;
            
//             setImageScale({
//                 width: useWidth ? img.width! * scale : 0,
//                 height: !useWidth ? img.height! * scale : 0
//             });
//         }
//     }
    
    
//     async function handleSVG(img: DBImage) {
//         if (props.scaling == "default") {
//             throw new Error("SVGs cannot use default scaling, as they have no dimensions.");
            
//         } else {
//             // smallfit and bigfit
//             if (!props.fitDims) {
//                 throw new Error("a non-default scaling requires fit dimensions");
//             }
            
//             const viewBox = img.src!.substring(img.src!.indexOf("viewBox")).split("\"")[1].split(" ").map(x => parseFloat(x));
//             const width = viewBox[2];
//             const height = viewBox[3];
            
//             const scale =  props.scaling == "bigfit" ?
//             Math.max(props.fitDims.width / width, props.fitDims.height / height) :
//             Math.min(props.fitDims.width / width, props.fitDims.height / height);
            
//             setImageScale({
//                 width: width * scale,
//                 height: height * scale
//             });
//         }
//     }
    
    
//     useEffect(() => {
//         const dirs = props.path.split("/");
//         const type = dirs[dirs.length - 1].split(".")[1].toLowerCase();
//         typeRef.current = type;

//         (async () => {
//             const res = await getImageData(props.path);
//             if (!res.error) {
//                 const img = res.unwrap();
//                 setImageData(img);
                
//                 if (type != "svg") {
//                     await handleNonSVG(img);
//                 } else {
//                     await handleSVG(img);
//                 }
//             }
//         })();
//     }, [props]);


//     return (
//         (typeRef.current == "svg") ?


//         // if SVG
//         (imageData && imageScale) && 
//         <div
//             dangerouslySetInnerHTML={{ __html: imageData.src! }}
//             style={imageScale}
//         /> 
        
        
//         :


//         // If not SVG
//         (imageData && imageScale) && <>
//             <Image
//                 width={imageData.width}
//                 height={imageData.height}
//                 alt={props.alt}
//                 src={imageData.src!}
//                 priority={props.priority}
//                 draggable={props.draggable}
//                 style={{
//                     width: imageScale.width ? `${imageScale.width}px` : "auto",
//                     height: imageScale.height ? `${imageScale.height}px` : "auto"
//                 }}
//                 unoptimized={props.unoptimized}
//             />
//         </>
//     );
// }