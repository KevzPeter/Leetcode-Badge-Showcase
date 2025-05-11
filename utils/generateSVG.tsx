import React from 'react'
import ReactDOMServer from 'react-dom/server';
import SvgWidget from '../components/SvgWidget';
import { allStyles } from '../styles/svg';
/**
 * 
 * @param {Array<any>} response - Array of LeetCode badge categories, each containing badges
 * @returns {height:number, width:number} 
 * Used to calculate dimensions of svg
 */
const calculateDimensions = (response: Array<any>, border: string) => {
    let height = 53 + (16 * 2); //header + padding top and bottom (1rem + 1rem)
    if (border === 'border') {
        height += 2; // add border of 1px on either side
    }
    let columns = 1;
    response.forEach(category => {
        height += 27; // category header
        height += Math.ceil(category.badges.length / 4) * 107; //height of row of badges = 107px;
        columns = Math.max(columns, category.badges.length);
    })
    let width = 300; //for 1, 2 columns
    if (columns == 3) width = 320;
    else if (columns >= 4) width = 400;
    return { height, width };
}
/**
 * Returns SVG as a string.
 */
export function generateSvg(response: Array<any>, username: string, imgSource: string, theme: string, border: string, animated: string): string {
    const { height, width } = calculateDimensions(response, border);
    const svgBody = ReactDOMServer.renderToStaticMarkup(
        <SvgWidget response={response} username={username} imgSource={imgSource} theme={theme} border={border} animated={animated} />
    );

    return `
    <svg
        width="${width}"
        height="${height}"
        viewBox="0 0 ${width} ${height}"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        font-family="Segoe UI, sans-serif"
        ${theme === 'invisible' ? 'style="background: transparent;"' : ''}
    >
    <style>${allStyles}</style>
    ${svgBody}
    </svg>`;
}
