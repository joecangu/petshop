// CSS
import styles from './Loader.module.css';

// IMPORT LOADER
import { Oval } from  'react-loader-spinner';

export default function Loader(){
    
    return(
        <div className={styles.loader}>
            <Oval
                height={80}
                width={80}
                color="rgba(4, 59, 92, 1)"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel='oval-loading'
                secondaryColor="rgba(4, 59, 92, 1)"
                strokeWidth={2}
                strokeWidthSecondary={2}
            />
        </div>
    )
}