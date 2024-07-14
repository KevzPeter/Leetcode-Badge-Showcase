import themes from "../utils/themes.json";

const Badge = ({ badge, theme, animated }) => {

    const imageSource: string = (animated === 'true' && badge.medal?.config?.iconGif?.length) ? badge.medal.config.iconGif : badge.icon;

    return (
        <div className="badge">
            <img src={imageSource} alt="badge" width={48} height={48} title={badge.displayName} />
            <p style={{ 'color': `${themes[theme].colorPrimary}` }}>{badge.shortName}</p>
            <h6 style={{ 'color': `${themes[theme].colorSecondary}` }}>{badge.creationDate}</h6>
        </div>
    )
}

export default Badge;