import { useState } from "react";
import { Example } from "./Example";

import styles from "./Example.module.css";

const EXAMPLES: { [key: string]: string[] } = {
  en: [
    "Tell me what you know about the Pauliteiros Dance",
    "What is the origin of the Pauliteiros Dance?",
    "What is the Lhaço?",
    "Tell me what you know about Miranda do Douro",
    "What are the main Pauliteiros groups of Miranda?"
  ],
  pt: [
    "Diz-me o que sabes sobre a Dança dos Pauliteiros",
    "Qual a origem da Dança dos Pauliteiros?",
    "O que é o Lhaço?",
    "Diz-me o que sabes sobre Miranda do Douro",
    "Quais são os principais grupos de Pauliteiros de Miranda?"
  ],
  es: [
    "Dime lo que sabes sobre la Danza de los Pauliteiros",
    "¿Cuál es el origen de la Danza de los Pauliteiros?",
    "¿Qué es el Lhaço?",
    "Dime lo que sabes sobre Miranda do Douro",
    "¿Cuáles son los principales grupos de Pauliteiros de Miranda?"
  ],
  pt_pt: [
    "Diz-me o que sabes sobre a Dança dos Pauliteiros",
    "Qual é a origem da Dança dos Pauliteiros?",
    "O que é o Lhaço?",
    "Diz-me o que sabes sobre Miranda do Douro",
    "Quais são os principais grupos de Pauliteiros de Miranda?"
  ]
};

interface Props {
  onExampleClicked: (value: string) => void;
}

export const ExampleList = ({ onExampleClicked }: Props) => {
  const [language, setLanguage] = useState<string>("en");

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  const examples = EXAMPLES[language];

  return (
    <div>
      <div className={styles.languageButtons}>
        <button onClick={() => handleLanguageChange("en")}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="#1D9DFF"/>
            {/* Adicione aqui o código SVG para a bandeira do inglês */}
          </svg>
        </button>
        <button onClick={() => handleLanguageChange("pt")}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="#FFD700"/>
            {/* Adicione aqui o código SVG para a bandeira do francês */}
          </svg>
        </button>
        <button onClick={() => handleLanguageChange("es")}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="#FF6347"/>
            {/* Adicione aqui o código SVG para a bandeira do espanhol */}
          </svg>
        </button>
      </div>
      <ul className={styles.examplesNavList}>
        {examples.map((question, i) => (
          <li key={i} className={styles.eacheli}>
            <Example text={question} value={question} onClick={onExampleClicked} />
          </li>
        ))}
      </ul>
    </div>
  );
};
