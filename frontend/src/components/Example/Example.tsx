import styles from "./Example.module.css";

interface Props {
    text: string;
    value: string;
    onClick: (value: string) => void;
}
//aqui que ele faz as perguntas pre determinadas o layout soh deixa o header  entao esse iframe nao precisa pq o chat eh o todo da pagina 
// o todo da pagina eh o chat  
// esse example.tsx é soh a parte das perguntas ele foi criado aqui 
    
export const Example = ({ text, value, onClick }: Props) => {
    return (
         
        //<div className={styles.container}>
        //    <div className={styles.row}>
        //        <div className={styles.col} onClick={() => onClick(value)}>
        //            <button type="submit" className={styles.outline}>{text}</button>
        //        </div>
        //    </div>
        //</div>
        
        //codigo original
        <div className={styles.container} onClick={() => onClick(value)}>
           <p className={styles.exampleText}>{text}</p>
        </div>
    );
};

