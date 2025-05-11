// @ts-nocheck
import Category from './Category';
import themes from '../utils/themes.json';
/**
 * The main SVG widget.
 */
export default function SvgWidget({ response, username, imgSource, theme, border, animated }): JSX.Element {
    const borderStyle = border === 'border' ? '1px solid #E4E2E2' : 'none';
    // Make SVG have transparent background if using invisible theme
    const isTransparent = theme === 'invisible';
    
    return (
        <g>
            <foreignObject x="0" y="0" width="100%" height="100%">
                <div xmlns="http://www.w3.org/1999/xhtml">
                    {response?.length > 0 &&
                        <div
                            className="showCase"
                            style={{
                                backgroundColor: `${themes[theme].background}`,
                                border: borderStyle,
                            }}
                        >
                            <div>
                                <span style={{ color: `${themes[theme].colorPrimary}` }} className='header'>
                                    <img src={imgSource} alt="LeetCode Logo" title="LeetCode Logo" width={36} height={36} />
                                    <span>{username} LeetCode Badges</span>
                                </span>
                                <hr style={{ backgroundColor: `${themes[theme].colorSecondary}` }} />
                            </div>
                            {response?.map((category: Object, index: number) => {
                                return (<Category category={category} key={index} theme={theme} border={border} animated={animated} />)
                            })}
                        </div>
                    }
                </div>
            </foreignObject>
        </g>
    );
}
