import { Stack } from "@fluentui/react";
import { animated, useSpring } from "@react-spring/web";

import styles from "./Answer.module.css";
import { AnswerIcon } from "./AnswerIcon";
import mirandaLogo from "../../assets/miranda.png";

export const AnswerLoading = () => {
    const animatedStyles = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 }
    });

    return (
        <animated.div style={{ ...animatedStyles }}>
            <Stack className={styles.answerContainer} verticalAlign="space-between">
            <img src={mirandaLogo} alt="Miranda do Douro Logo" aria-label="Miranda do Douro Logo" width="28" height="28"></img>
                <Stack.Item grow>
                    <p className={styles.answerText}>
                        A pensar....
                        <span className={styles.loadingdots} />
                    </p>
                </Stack.Item>
            </Stack>
        </animated.div>
    );
};
