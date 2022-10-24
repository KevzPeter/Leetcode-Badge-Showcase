import styles from "../styles/Home.module.scss"

const Badge=({badge})=>{
    return(
        <div className="badge">
            <img src={badge.icon} alt="badge" width={64} height={64} title={badge.displayName}/>
            <p>{badge.shortName}</p>
            <h6>{badge.creationDate}</h6>
        </div>
    )
}

export default Badge;