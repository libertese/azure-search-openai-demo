import { Example } from "./Example";

import styles from "./Example.module.css";

export type ExampleModel = {
    text: string;
    value: string;
};

const EXAMPLES: ExampleModel[] = [
    {
        text: "Diz-me o que sabes sobre a Dança dos Pauliteiros",
        value: "Diz-me o que sabes sobre a Dança dos Pauliteiros"
    },
    {
        text: "Qual a origem da Dança dos Pauliteiros?",
        value: "Qual a origem da Dança dos Pauliteiros?"
    },

    {
        text: "O que é o Lhaço?",
        value: "O que é o Lhaço?"
    },

    {
        text: "Diz-me o que sabes sobre Miranda do Douro",
        value: "Diz-me o que sabes sobre Miranda do Douro"
    },

    {
        text: "Quais são os principais grupos de Pauliteiros de Miranda?",
        value: "Quais são os principais grupos de Pauliteiros de Miranda?"
    }
];

interface Props {
    onExampleClicked: (value: string) => void;
}

export const ExampleList = ({ onExampleClicked }: Props) => {
    return (
        <ul className={styles.examplesNavList}>
            {EXAMPLES.map((x, i) => (
                <li key={i} className={styles.eacheli}>
                    <Example text={x.text} value={x.value} onClick={onExampleClicked} />
                </li>
            ))}
        </ul>
    );
};
