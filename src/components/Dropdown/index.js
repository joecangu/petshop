// CSS
import styles from './Dropdown.module.css';

export default function Dropdown({ children }){
    

    return(
        <div className={styles.dropdown}>
            {children}
        </div>
    )
}