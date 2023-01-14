import React from 'react'
import ReactDOMServer from 'react-dom/server';
import { StyleRegistry, useStyleRegistry } from 'styled-jsx'
import SvgWidget from '../components/SvgWidget';
import { allStyles } from '../styles/svg';
/**
 * 
 * @param response:Array<any>
 * @returns {height:number, width:number}
 * Used to calculate dimensions of svg
 */
const calculateDimensions=(response:Array<any>)=>{
    let height = 100;
    let columns = 1;
    response.forEach(category=>{
        height += 53;
        height += Math.ceil(category.badges.length / 4) * 190;
        columns = Math.max(columns, category.badges.length);
    })
    let width = 320; //for 1, 2 columns
    if(columns == 3) width = 360;
    else if(columns >= 4) width = 440;
    return {height, width};
}
/**
 * Returns SVG as a string.
 */
export function generateSvg(response:Array<any>, username:string, imgSource:string, theme:string): string {
    const {height, width} = calculateDimensions(response);
    const svgBody = ReactDOMServer.renderToStaticMarkup(
        <SvgWidget response={response} username={username} imgSource={imgSource} theme={theme}/>
    );

    return `
    <svg
        width="${width}"
        height="${height}"
        viewBox="0 0 ${width} ${height}"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        font-family="Segoe UI, sans-serif"
    >
    <style>${allStyles}</style>
    ${svgBody}
    </svg>`;
}
