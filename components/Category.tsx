import styles from "../styles/Home.module.scss"
import Badge from "./Badge";

const categoryEnum = {
    DCC : 'Daily Medals',
    STUDY_PLAN : 'Study Plan Medals',
    COMPETITION : 'Competition Medals'
}

const Category=({category})=>{
    return(
        <div className="category">
            <p id="title">{categoryEnum[category.categoryName]}</p>
            <div className="grid">
                {category.badges.map((badge : Object, index : number) => {
                    return(<Badge badge={badge} key={index}/>)
                })}
            </div>
        </div>
    )
}

export default Category;