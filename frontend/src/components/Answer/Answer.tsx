import { useMemo, useEffect } from "react";
import { Stack, IconButton } from "@fluentui/react";
import DOMPurify from "dompurify";
import { useState } from "react";
import styles from "./Answer.module.css";
import { TextAnalyticsClient, AzureKeyCredential } from "@azure/ai-text-analytics";

import { AskResponse, getCitationFilePath } from "../../api";
import { parseAnswerToHtml } from "./AnswerParser";
import { AnswerIcon } from "./AnswerIcon";
import mirandaLogo from "../../assets/miranda.png";
import { ThumbLike24Regular, ThumbDislike24Regular } from "@fluentui/react-icons";
import { AiOutlinePlaySquare } from "react-icons/ai";
import { PiPlay } from "react-icons/pi";

import { AnswerFeedbackRequest, AnswerFeedbackResponse, feedbackApi } from "../../api";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { usecontrolaudio } from "../../hooks/usecontrolaudio";
interface Props {
    answer: AskResponse;
    isSelected?: boolean;
    onCitationClicked: (filePath: string) => void;
    onThoughtProcessClicked: () => void;
    onSupportingContentClicked: () => void;
    onFollowupQuestionClicked?: (question: string) => void;
    showFollowupQuestions?: boolean;
    playsound: boolean;
}

export const Answer = ({
    answer,
    isSelected,
    onCitationClicked,
    onThoughtProcessClicked,
    onSupportingContentClicked,
    onFollowupQuestionClicked,
    showFollowupQuestions,
    playsound
}: Props) => {
    const parsedAnswer = useMemo(() => parseAnswerToHtml(answer.answer, onCitationClicked), [answer]);

    const sanitizedAnswerHtml = DOMPurify.sanitize(parsedAnswer.answerHtml);

    const [positiveFeedback, setPositiveFeedback] = useState<boolean>(false);
    const [negativeFeedback, setNegativeFeedback] = useState<boolean>(false);
    const { audiostatus, setaudiostatus } = usecontrolaudio();

    console.log("audiozustand", audiostatus);
    const sendPositiveFeedback = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>, _feedbackId: string) => {
        if (positiveFeedback == true) setPositiveFeedback(false);
        else {
            setPositiveFeedback(true);
            setNegativeFeedback(false);
        }

        try {
            const request: AnswerFeedbackRequest = {
                feedbackId: String(answer.questionid),
                feedback: true
            };
            const result = await feedbackApi(request);
        } catch (e) {
            console.log("Entrou no cast ", e);
        }
    };

    const sendNegativeFeedback = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>, _feedbackId: string) => {
        if (negativeFeedback == true) setNegativeFeedback(false);
        else {
            setNegativeFeedback(true);
            setPositiveFeedback(false);
        }
        try {
            const request: AnswerFeedbackRequest = {
                feedbackId: String(answer.questionid),
                feedback: false
            };
            const result = await feedbackApi(request);
        } catch (e) {
            console.log("Entrou no cast ", e);
        }
    };

    const handleVoiceOutput = async (resposta: any, playsound: boolean) => {
        console.log("here");

        const player = new sdk.SpeakerAudioDestination();
        const pause = () => {
            player.close();
        };

        const resume = () => {
            player.resume();
        };

        if (playsound) {
            const speechConfig = sdk.SpeechConfig.fromSubscription("54f08182a9654cca8e01cf697e38b004", "westeurope");

            // Set the target language for text-to-speech
            const key = "7cd6d206a3b54d2a9e932eb3ce67636f";
            const endpoint = "https://mirandaescuta.cognitiveservices.azure.com/";
            const client = new TextAnalyticsClient(endpoint, new AzureKeyCredential(key));

            // Detect the language of the text
            const response = await client.detectLanguage([resposta]);

            const detectedLanguage = response[0];

            var language = "pt";
            var VoiceName = "pt-PT-DuarteNeural";
            if ("error" in detectedLanguage) {
                console.error("Error:", detectedLanguage.error);
            } else {
                console.log(detectedLanguage.primaryLanguage);
                language = detectedLanguage.primaryLanguage.iso6391Name.toString();
                console.log(detectedLanguage.primaryLanguage.iso6391Name.toString());
                // Access the properties of detectedLanguage here, if it is not an error.
            }
            switch (language) {
                case "pt":
                    var VoiceName = "pt-PT-DuarteNeural";
                    break;
                case "fr":
                    VoiceName = "fr-FR-HenriNeural";
                    break;
                case "en":
                    VoiceName = "en-US-GuyNeural";
                    break;
                case "es":
                    VoiceName = "es-ES-PabloNeural";
                    break;
                case "de":
                    VoiceName = "de-DE-StefanNeural";
                    break;
                case "it":
                    VoiceName = "it-IT-CosimoNeural";
                    break;
                case "ja":
                    VoiceName = "ja-JP-KeitaNeural";
                    break;
                case "ru":
                    VoiceName = "ru-RU-PavelNeural";
                    break;
                case "ar":
                    VoiceName = "ar-SA-NaayfNeural";
                    break;
                case "zh":
                    VoiceName = "zh-CN-KangkangNeural";
                    break;
                default:
                    console.log("Unsupported language.1111");
                    return;
            }

            speechConfig.speechSynthesisLanguage = language;
            speechConfig.speechSynthesisVoiceName = VoiceName;
            console.log("language " + language);
            console.log("VoiceName  " + VoiceName);
            const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput(); // Use default speaker output for audio
            const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
            const player = new sdk.SpeakerAudioDestination();

            const audioConfigplayer = sdk.AudioConfig.fromSpeakerOutput(player);
            //const syn = new sdk.SpeechSynthesizer(speechConfig, audioConfig)
            const textToSpeak = resposta; // Replace with your desired text

            synthesizer.speakTextAsync(
                textToSpeak,
                (result: { reason: sdk.ResultReason }) => {
                    console.log("player", player);
                    // player.pause()
                    if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                        console.log("Speech synthesis is complete.");
                    }
                    sdk.ResultReason.SynthesizingAudio;
                    console.log(result);
                    console.log("result.reason :" + result.reason);
                    console.log(sdk.ResultReason.Canceled);
                    if (audiostatus == "pause") player.pause();
                    synthesizer.close();
                },
                (err: string) => {
                    console.trace("err - " + err);
                    synthesizer.close();
                }
            );
        } else {
            console.log("sound off");
        }
        player.close();
    };

    useEffect(() => {
        handleVoiceOutput(answer.answer, playsound);
        setaudiostatus("initial");
    }, [answer]);

    return (
        <Stack className={`${styles.answerContainer} ${isSelected && styles.selected}`} verticalAlign="space-between">
            <div className={styles.answerHeader}>
                <Stack.Item>
                    <Stack horizontal horizontalAlign="space-between">
                        <img src={mirandaLogo} alt="Miranda do Douro Logo" aria-label="Miranda do Douro Logo" width="28" height="28"></img>
                        <div></div>
                    </Stack>
                </Stack.Item>
                <div className={styles.buttonsAnswerFeedback}>
                    <div className={styles.buttonLike} onClick={event => sendPositiveFeedback(event, answer.questionid)}>
                        <ThumbLike24Regular
                            primaryFill="rgb(50, 205, 50)"
                            className={`${positiveFeedback ? styles.likeCliked : ""} ${styles.like}`}
                        ></ThumbLike24Regular>
                    </div>
                    <div className={styles.buttonDislike} onClick={event => sendNegativeFeedback(event, answer.questionid)}>
                        <ThumbDislike24Regular
                            primaryFill="rgb(255, 0, 0)"
                            className={`${negativeFeedback ? styles.dislikeCliked : ""} ${styles.dislike}`}
                        ></ThumbDislike24Regular>
                    </div>
                </div>
            </div>
            <Stack.Item grow>
                <div className={styles.answerText} dangerouslySetInnerHTML={{ __html: sanitizedAnswerHtml.replace('"', "").replace('"', "") }}></div>
            </Stack.Item>

            {!!parsedAnswer.citations.length && (
                <Stack.Item>
                    <Stack horizontal wrap tokens={{ childrenGap: 5 }}>
                        <span className={styles.citationLearnMore}>Citações:</span>
                        {parsedAnswer.citations.map((x, i) => {
                            const path = getCitationFilePath(x);
                            return (
                                <a
                                    key={i}
                                    className={styles.citation}
                                    title={` ${x.replace(/[-\d+]|_[pP]ag|\.[pP][dD][fF]/g, "").replace(/_/g, " ")}`}
                                    onClick={() => onCitationClicked(path)}
                                >
                                    {`${++i}. ${x.replace(/[-\d+]|_[pP]ag|\.[pP][dD][fF]/g, "").replace(/_/g, " ")}`}
                                </a>
                            );
                        })}
                    </Stack>
                </Stack.Item>
            )}

            {!!parsedAnswer.followupQuestions.length && showFollowupQuestions && onFollowupQuestionClicked && (
                <Stack.Item>
                    <Stack horizontal wrap className={`${!!parsedAnswer.citations.length ? styles.followupQuestionsList : ""}`} tokens={{ childrenGap: 6 }}>
                        <span className={styles.followupQuestionLearnMore}>Follow-up questions:</span>
                        {parsedAnswer.followupQuestions.map((x, i) => {
                            return (
                                <a key={i} className={styles.followupQuestion} title={x} onClick={() => onFollowupQuestionClicked(x)}>
                                    {`${x}`}
                                </a>
                            );
                        })}
                    </Stack>
                </Stack.Item>
            )}
        </Stack>
    );
};
