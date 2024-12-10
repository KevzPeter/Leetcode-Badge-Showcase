import Badge from "./Badge";
import themes from '../utils/themes.json';

const categoryEnum = {
    DCC: 'Daily Badges',
    STUDY_PLAN: 'Study Plan Badges',
    COMPETITION: 'Competition Badges',
    ANNUAL: 'Annual Badges',
    SUBMISSION: 'Submission Badges'
}

const Category = ({ category, theme, animated }) => {
    return (
        <div className="category">
            <p id="title" style={{ 'color': `${themes[theme].colorSecondary}` }}>{categoryEnum[category.categoryName]}</p>
            <div className="grid">
                {category.badges.map((badge: Object, index: number) => {
                    return (<Badge badge={badge} key={index} theme={theme} animated={animated} />)
                })}
            </div>
        </div>
    )
}

export default Category;