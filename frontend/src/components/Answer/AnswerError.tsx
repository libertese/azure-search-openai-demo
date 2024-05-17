import { Stack, PrimaryButton } from "@fluentui/react";
import { ErrorCircle24Regular } from "@fluentui/react-icons";

import styles from "./Answer.module.css";

interface Props {
    error: string;
    onRetry: () => void;
}

export const AnswerError = ({ error, onRetry }: Props) => {
    return (
        <Stack className={styles.answerContainer} verticalAlign="space-between">
            <ErrorCircle24Regular aria-hidden="true" aria-label="Error icon" primaryFill="red" />

            <Stack.Item grow>
                <p className={styles.answerText}>
                    Os nossos servidores encontram-se atualmente ocupados devido a uma elevada procura. Por favor, limpe o chat e tente novamente. Agradecemos a
                    sua compreensão.
                </p>
            </Stack.Item>

            <PrimaryButton className={styles.retryButton} onClick={onRetry} text="Tente Novamente" />
        </Stack>
    );
};
