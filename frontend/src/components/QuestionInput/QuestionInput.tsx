import { useEffect, useState } from "react";
import { Stack, TextField } from "@fluentui/react";
import { Send28Filled, Mic28Filled, Record24Regular } from "@fluentui/react-icons";
import { PiMicrophoneFill } from 'react-icons/pi'
import styles from "./QuestionInput.module.css";

interface Props {
    onSend: (question: string) => void;
    disabled: boolean;
    placeholder?: string;
    clearOnSend?: boolean;
    onListen: () => void;
    isActive: boolean;
}

export const QuestionInput = ({ onSend, disabled, placeholder, clearOnSend, onListen, isActive }: Props) => {
    const [question, setQuestion] = useState<string>("");

    const sendQuestion = () => {
        if (disabled || !question.trim()) {
            return;
        }

        onSend(question);

        if (clearOnSend) {
            setQuestion("");
        }
    };

    const onEnterPress = (ev: React.KeyboardEvent<Element>) => {
        if (ev.key === "Enter" && !ev.shiftKey) {
            ev.preventDefault();
            sendQuestion();
        }
    };

    const onQuestionChange = (_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        if (!newValue) {
            setQuestion("");
        } else if (newValue.length <= 1000) {
            setQuestion(newValue);
        }
    };

    const sendQuestionDisabled = disabled || !question.trim();

    return (
        <Stack horizontal className={styles.questionInputContainer}>
            <TextField
                className={styles.questionInputTextArea}
                placeholder={placeholder}
                multiline
                resizable={false}
                borderless
                value={question}
                onChange={onQuestionChange}
                onKeyDown={onEnterPress}
            />
            <div className={styles.questionInputButtonsContainer}>
                <div
                    className={`${styles.questionInputSendButton} ${sendQuestionDisabled ? styles.questionInputSendButtonDisabled : ""} ${styles.microphone}}`}
                    aria-label="Diga algo para mim"
                    onClick={() => {
                        onListen();
                    }}
                >
                 <PiMicrophoneFill size={24} style={{color: isActive ? "#1d9dff" :  "rgba(29,157,255, 1)" }}  />
                </div>
                <div
                    className={`${styles.questionInputSendButton} ${sendQuestionDisabled ? styles.questionInputSendButtonDisabled : ""}`}
                    aria-label="Me pergunte algo"
                    onClick={sendQuestion}
                >
                    <Send28Filled primaryFill="rgb(29,157,255)" color="#1d9dff" style={{color: "#1d9dff" }} />
                </div>
            </div>
        </Stack>
    );
};
