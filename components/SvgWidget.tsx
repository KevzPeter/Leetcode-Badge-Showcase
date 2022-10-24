// @ts-nocheck
import Category from './Category';
/**
 * The main SVG widget.
 */
export default function SvgWidget({response}): JSX.Element {
    return (
        <g>
            <foreignObject x="0" y="0" width="100%" height="100%">
                <div xmlns="http://www.w3.org/1999/xhtml">
                {response?.length > 0 && <div className="showCase">
                <h4>LeetCode Badge List</h4>
                {response?.map((category:Object, index:number)=>{
                    return(<Category category={category} key={index}/>)
                })}
                </div>}
                </div>
            </foreignObject>
        </g>
    );
}
