// CSS
import styles from './Title.module.css';

export default function Title({ children, titulo }){
    

    return(
        <div className={styles.title}>
            {children}
            <span>{titulo}</span>
        </div>
    )
}