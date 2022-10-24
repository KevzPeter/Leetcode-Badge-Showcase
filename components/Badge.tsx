import styles from "../styles/Home.module.scss"

const Badge=({badge})=>{
    return(
        <div className={styles.badge}>
            <img src={badge.medal.config.iconGif} alt="badge" width={64} height={64} title={badge.displayName}/>
            <p>{badge.shortName}</p>
            <h6>{badge.creationDate}</h6>
        </div>
    )
}

export default Badge;