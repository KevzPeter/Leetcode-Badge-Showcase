// @ts-nocheck
import Category from './Category';
import themes from '../utils/themes.json';
/**
 * The main SVG widget.
 */
export default function SvgWidget({response, username, imgSource, theme}): JSX.Element {

    return (
        <g>
            <foreignObject x="0" y="0" width="100%" height="100%">
                <div xmlns="http://www.w3.org/1999/xhtml">
                    {response?.length > 0 && 
                        <div className="showCase" style={{'background-color': `${themes[theme].background}`}}>
                            <h5 style={{'color': `${themes[theme].colorPrimary}`}}>
                                <img src={imgSource} alt="LeetCode Logo" title="LeetCode Logo" width={36} height={36}/>&nbsp;
                                <a href={`https://leetcode.com/${username}`} target="_blank" rel="noreferrer">{username}</a>&nbsp;LeetCode Badges
                            </h5>
                            <hr style={{'background-color': `${themes[theme].colorSecondary}`}} />
                            {response?.map((category:Object, index:number)=>{
                                return(<Category category={category} key={index} theme={theme}/>)
                            })}
                        </div>
                    }
                </div>
            </foreignObject>
        </g>
    );
}
