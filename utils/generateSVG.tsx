import React from 'react'
import ReactDOMServer from 'react-dom/server';
import { StyleRegistry, useStyleRegistry } from 'styled-jsx'
import SvgWidget from '../components/SvgWidget';
import { allStyles } from '../styles/svg';

function Styles() {
    const registry = useStyleRegistry()
    const styles = registry.styles()
    return <>{styles}</>
  }
/**
 * Returns SVG as a string.
 */
export function generateSvg(response, username): string {
    let height = 100;
    response.forEach(category=>{
        height += 53;
        height += Math.ceil(category.badges.length / 4) * 190;
    })
    const width = 600;
    const svgBody = ReactDOMServer.renderToStaticMarkup(
        <SvgWidget response={response} username={username}/>
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
