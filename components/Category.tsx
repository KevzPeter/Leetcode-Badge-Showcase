import styles from "../styles/Home.module.scss"
import Badge from "./Badge";
import themes from '../utils/themes.json';

const categoryEnum = {
    DCC : 'Daily Medals',
    STUDY_PLAN : 'Study Plan Medals',
    COMPETITION : 'Competition Medals'
}

const Category=({category, theme})=>{
    return(
        <div className="category">
            <p id="title" style={{'color': `${themes[theme].colorSecondary}`}}>{categoryEnum[category.categoryName]}</p>
            <div className="grid">
                {category.badges.map((badge : Object, index : number) => {
                    return(<Badge badge={badge} key={index} theme={theme}/>)
                })}
            </div>
        </div>
    )
}

export default Category;