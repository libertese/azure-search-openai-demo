import { useRef, useState, useEffect } from "react";
import Modal from "react-modal";
import { Checkbox, Panel, DefaultButton, TextField, SpinButton } from "@fluentui/react";
import { SparkleFilled } from "@fluentui/react-icons";
import mirandachat from "../../assets/miranda.png";
import pauliteiro from "../../assets/Pauliteiro.jpg";
import styles from "./Chat.module.css";
import { Helmet } from "react-helmet";
import videoPauliteiros from "./pauliteiros_1.mp4";
import newPauliteiro from "./new-pauliteiros.mp4";

import { HiOutlineTrash } from "react-icons/hi";
import { BsVolumeUpFill, BsVolumeMuteFill } from "react-icons/bs";
import { BsSend } from "react-icons/bs";
import { AiOutlineAudio } from "react-icons/ai";
//import video from "../../assets/23Pauliteiro.mp4";
//import newPauliteiro from "../../assets/24Pauliteiro.mp4";

import { chatApi, Approaches, AskResponse, ChatRequest, ChatTurn } from "../../api";
import { Answer, AnswerError, AnswerLoading } from "../../components/Answer";
import { QuestionInput } from "../../components/QuestionInput";
import { ExampleList } from "../../components/Example";
import { UserChatMessage } from "../../components/UserChatMessage";
import { AnalysisPanel, AnalysisPanelTabs } from "../../components/AnalysisPanel";
import { SettingsButton } from "../../components/SettingsButton";
import { ClearChatButton } from "../../components/ClearChatButton";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { loadScript } from "./helper";
import { TextAnalyticsClient, AzureKeyCredential } from "@azure/ai-text-analytics";
import { Mic28Filled, Record24Regular } from "@fluentui/react-icons";
import { handleVoiceOutput } from "../../utils/handlevoiceoutput";
import { usecontrolaudio } from "../../hooks/usecontrolaudio";

const Chat = () => {
    const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
    const [promptTemplate, setPromptTemplate] = useState("");
    const [retrieveCount, setRetrieveCount] = useState(3);
    const [useSemanticRanker, setUseSemanticRanker] = useState(true);
    const [useSemanticCaptions, setUseSemanticCaptions] = useState(false);
    const [excludeCategory, setExcludeCategory] = useState("");
    const [useSuggestFollowupQuestions, setUseSuggestFollowupQuestions] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [showVideo, setShowVideo] = useState(false);

    const [isAvatarActive, setIsAvatarActive] = useState(false);
    const [isSoundOn, setIsSoundOn] = useState(true);

    const { audiostatus, setaudiostatus } = usecontrolaudio();

    const [showPopup, setShowPopup] = useState(false);

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 480px)");
        const handleMediaQueryChange = (e: { matches: boolean | ((prevState: boolean) => boolean) }) => {
            setIsMobile(e.matches);
        };

        setIsMobile(mediaQuery.matches);

        mediaQuery.addListener(handleMediaQueryChange);

        return () => {
            mediaQuery.removeListener(handleMediaQueryChange);
        };
    }, []);

    const myDiv = document.getElementById("myDiv");
    if (myDiv) {
        myDiv.addEventListener("click", () => {
            window.location.href = "frontendsrcpagesavatarsindex.html";
        });
    }

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const openPopup = () => {
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    const [showPopupDisclaimer, setShowPopupDisclaimer] = useState(true);

    const togglePopupDisclaimer = () => {
        setShowPopupDisclaimer(!showPopupDisclaimer);
    };

    const closePopupDisclaimer = () => {
        setShowPopupDisclaimer(false);
    };

    const lastQuestionRef = useRef("");
    const chatMessageStreamEnd = useRef<HTMLDivElement>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null); // Explicitly define the type as Error or null

    const [activeCitation, setActiveCitation] = useState<string | undefined>();
    const [activeAnalysisPanelTab, setActiveAnalysisPanelTab] = useState<AnalysisPanelTabs | undefined>(undefined);

    const [selectedAnswer, setSelectedAnswer] = useState(0);
    const [answers, setAnswers] = useState<[string, AskResponse][]>([]);

    const textAnalyticsClient = new TextAnalyticsClient(
        "https://mirandaescuta.cognitiveservices.azure.com/",
        new AzureKeyCredential("7cd6d206a3b54d2a9e932eb3ce67636f")
    );

    const makeApiRequest = async (question: string) => {
        lastQuestionRef.current = question;

        error && setError(null);
        setIsLoading(true);
        setActiveCitation(undefined);
        setActiveAnalysisPanelTab(undefined);

        try {
            const history: ChatTurn[] = answers.map(a => ({
                user: a[0],
                bot: a[1].answer
            }));
            const request: ChatRequest = {
                history: [...history, { user: question, bot: undefined }],
                approach: Approaches.ReadRetrieveRead,
                overrides: {
                    promptTemplate: promptTemplate.length === 0 ? undefined : promptTemplate,
                    excludeCategory: excludeCategory.length === 0 ? undefined : excludeCategory,
                    top: retrieveCount,
                    semanticRanker: useSemanticRanker,
                    semanticCaptions: useSemanticCaptions,
                    suggestFollowupQuestions: useSuggestFollowupQuestions
                }
            };
            const result = await chatApi(request);
            setAnswers([...answers, [question, result]]);
        } catch (e) {
            setError(e as Error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleVoiceInput = () => {
        const speechConfig = sdk.SpeechConfig.fromSubscription("54f08182a9654cca8e01cf697e38b004", "westeurope");
        speechConfig.speechRecognitionLanguage = "pt-PT";
        setIsActive(true);
        const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
        let recognizer: sdk.SpeechRecognizer | undefined;

        recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

        recognizer.recognizeOnceAsync(
            (result: { text: any }) => {
                const recognizedText = result.text;
                console.log("recognized", recognizedText);
                makeApiRequest(recognizedText);

                recognizer?.close();
                setIsActive(false);
                recognizer = undefined;
            },
            (err: string) => {
                console.trace("err - " + err);

                recognizer?.close();
                recognizer = undefined;
            }
        );

        // const player = new sdk.SpeakerAudioDestination();
    };

    const player = new sdk.SpeakerAudioDestination();

    const clearChat = () => {
        lastQuestionRef.current = "";
        error && setError(null);
        setActiveCitation(undefined);
        setActiveAnalysisPanelTab(undefined);
        setAnswers([]);
    };

    //useEffect(() => { chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" });}, [isLoading]);
    // const element = document.createElement("questionchat");
    //element.scrollTop = element.scrollHeight;

    /*  function handlescroll() {
      // create a new element
      const element = document.createElement('questionchat');
   
      const list = document.getElementById("myList");
      list.appendChild(element);
      element.scrollIntoView();
   }*/

    const onPromptTemplateChange = (_ev?: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setPromptTemplate(newValue || "");
    };

    const onRetrieveCountChange = (_ev?: React.SyntheticEvent<HTMLElement, Event>, newValue?: string) => {
        setRetrieveCount(parseInt(newValue || "3"));
    };

    const onUseSemanticRankerChange = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setUseSemanticRanker(!!checked);
    };

    const onUseSemanticCaptionsChange = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setUseSemanticCaptions(!!checked);
    };

    const onExcludeCategoryChanged = (_ev?: React.FormEvent, newValue?: string) => {
        setExcludeCategory(newValue || "");
    };

    const onUseSuggestFollowupQuestionsChange = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setUseSuggestFollowupQuestions(!!checked);
    };

    const onExampleClicked = (example: string) => {
        makeApiRequest(example);
        setShowVideo(true);
    };

    const onShowCitation = (citation: string, index: number) => {
        if (activeCitation === citation && activeAnalysisPanelTab === AnalysisPanelTabs.CitationTab && selectedAnswer === index) {
            setActiveAnalysisPanelTab(undefined);
        } else {
            setActiveCitation(citation);
            setActiveAnalysisPanelTab(AnalysisPanelTabs.CitationTab);
        }

        setSelectedAnswer(index);
    };

    const onToggleTab = (tab: AnalysisPanelTabs, index: number) => {
        if (activeAnalysisPanelTab === tab && selectedAnswer === index) {
            setActiveAnalysisPanelTab(undefined);
        } else {
            setActiveAnalysisPanelTab(tab);
        }

        setSelectedAnswer(index);
    };

    const closeAnalysisPanel = () => {
        setActiveAnalysisPanelTab(undefined);
    };

    //const latestaudio =  answers[answers.length - 1]?.[1].answer;

    return (
        <div className={styles.container}>
            <Modal
                isOpen={showPopup}
                onRequestClose={closePopup}
                contentLabel="Custom Pop-up"
                className={styles.popupContainer}
                overlayClassName={styles.overlay}
            >
                <div>
                    <button className={styles.closeButton} onClick={closePopup}>
                        x Fechar
                    </button>
                    <h2>Sobre o GPM</h2>
                    <p>O Guia Prático do Município é uma ferramenta ao dispor de todos os cidadãos, que pretende preservar e propagar a Cultura Regional.</p>
                    <p>
                        O GPM é baseado no modelo de linguagem GPT, criado pela OpenAI e pela Microsoft e disponibilizado na plataforma Microsoft Azure OpenAI.
                    </p>
                    <p>
                        O GPM foi desenvolvido pela parceria CIT-TTM (Centro de Inovação e Tecnologia Terras de Trás-os-Montes) e a TAC Services Portugal, com o
                        apoio da Microsoft, tendo como objetivo a interação com o cidadão através de linguagem natural
                    </p>
                </div>
            </Modal>
            <Modal
                isOpen={showPopupDisclaimer}
                onRequestClose={closePopupDisclaimer}
                contentLabel="Custom Pop-up"
                className={styles.popupContainer}
                overlayClassName={styles.overlay}
            >
                <div>
                    <button className={styles.closeButton} onClick={closePopupDisclaimer}>
                        x
                    </button>
                    <br></br>
                    <h2> Bem-vindo à versão Beta do GPM!</h2>
                    <p>Para melhorar o assistente virtual, as perguntas e as respostas geradas serão armazenadas por um período de 7 dias.</p>
                    <p>
                        Pedimos que não insira dados pessoais quando colocar as suas questões. Caso o faça, os mesmos serão guardados, à semelhança de todas as
                        perguntas e respostas, durante 7 dias, para efeitos de melhoria do serviço. Após esse prazo, serão eliminados.
                    </p>
                    <p>Use as sugestões de perguntas, ou coloque sua própria questão na área indicada:</p>
                </div>
            </Modal>
            <div
                //className={styles.chatRoot}
                style={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#fff",
                    width: "100%",
                    height: "100%",
                    margin: "auto"
                }}
            >
                {/* <div className={styles.chatContainer}> */}
                {!lastQuestionRef.current ? (
                    // <div
                    //   className={styles.chatEmptyState}
                    //   style={{ maxHeight: "100vh", height: "100vh" }}
                    // >
                    <div className={styles.chatWrapper}>
                        <div style={{ display: "flex" }}>
                            <div
                                style={{
                                    // display: "flex",
                                    // flexDirection: "column",
                                    // gap: "10px",
                                    justifyContent: "end",
                                    paddingLeft: "10px",
                                    position: "relative",
                                    width: "100%"
                                }}
                            >
                                <div
                                    style={{
                                        marginBottom: "0",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "end",
                                        alignItems: "center",
                                        overflow: "hidden"
                                    }}
                                    className={styles.avatarWelcome}
                                >
                                    <video
                                        id="Welcomeavatar"
                                        src={newPauliteiro}
                                        controls={false}
                                        autoPlay={true}
                                        loop
                                        muted
                                        disablePictureInPicture
                                        controlsList="nodownload"
                                        className={styles.VideoAvatarWelcome}
                                    />
                                </div>
                                {isActive ? (
                                    <button className={styles.btnVoiceRedondo} style={{ position: "absolute" }} onClick={handleVoiceInput}>
                                        <Record24Regular color="#1d9dff" primaryFill="rgb(29,157,255)" />
                                    </button>
                                ) : (
                                    <button className={styles.btnVoiceRedondo} style={{ position: "absolute" }} onClick={handleVoiceInput}>
                                        <Mic28Filled /> 
                                    </button>
                                )}
                                {/* <div> */}
                                <div
                                    id="linha 365"
                                    className={styles.volumeIconWrapper}
                                    onClick={() => {
                                        setIsSoundOn(!isSoundOn);
                                        isSoundOn ? setaudiostatus("pause") : setaudiostatus("resume");
                                    }}
                                >
                                    {isSoundOn ? (
                                        <BsVolumeUpFill style={{ color: "white" }} size={32} />
                                    ) : (
                                        <BsVolumeMuteFill style={{ color: "white" }} size={32} />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div
                            //className={styles.formContent}
                            style={{
                                paddingTop: "50px",
                                paddingRight: "10px",
                                display: "flex", // {/*justifyContent: "space-between",
                                justifyContent: "space-between",
                                flexDirection: "column"
                            }}
                        >
                            <div className={styles.boxSugestoes}>
                                <p className={styles.suggestionsTitle}>Sugestões de perguntas:</p>
                                <div>
                                    <ExampleList onExampleClicked={onExampleClicked} />
                                </div>
                            </div>

                            <div>
                                <ClearChatButton className={styles.commandButtonDelete} onClick={clearChat} disabled={!lastQuestionRef.current || isLoading} />
                                <QuestionInput
                                    clearOnSend
                                    placeholder="Digite a sua Pergunta"
                                    disabled={isLoading}
                                    onSend={question => makeApiRequest(question)}
                                    onListen={handleVoiceInput}
                                    isActive={isActive}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    // </div>
                    <>
                        <div className={styles.chatWrapper}>
                            <div style={{ display: "flex" }}>
                                <div
                                    style={{
                                        // display: "flex",
                                        // flexDirection: "column",
                                        // gap: "10px",
                                        justifyContent: "end",
                                        paddingLeft: "10px",
                                        position: "relative",
                                        width: "100%"
                                    }}
                                >
                                    <div
                                        style={{
                                            marginBottom: "0",
                                            height: "calc(100vh - 60px)",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "end",
                                            alignItems: "center",
                                            overflow: "hidden"
                                        }}
                                        className={styles.avatar}
                                    >
                                        <video
                                            id="Video no chat"
                                            src={newPauliteiro}
                                            controls={false}
                                            autoPlay={true}
                                            loop
                                            width="100%"
                                            muted
                                            disablePictureInPicture
                                            controlsList="nodownload"
                                            className={styles.Avatarchat}
                                        />

                                        {isActive ? (
                                            <button className={styles.btnVoiceRedondo} style={{ position: "absolute" }} onClick={handleVoiceInput}>
                                                <Record24Regular color="#1d9dff" primaryFill="rgb(29,157,255)" />
                                            </button>
                                        ) : (
                                            <button className={styles.btnVoiceRedondo} style={{ position: "absolute" }} onClick={handleVoiceInput}>
                                                <Mic28Filled /> 
                                            </button>
                                        )}
                                    </div>
                                    {/* <div> */}
                                    <div
                                        id="linha 461"
                                        className={styles.volumeNotMobile}
                                        onClick={() => {
                                            setIsSoundOn(!isSoundOn);
                                            isSoundOn ? setaudiostatus("pause") : setaudiostatus("resume");
                                        }}
                                    >
                                        {isSoundOn ? (
                                            <BsVolumeUpFill style={{ color: "white" }} size={32} />
                                        ) : (
                                            <BsVolumeMuteFill style={{ color: "white" }} size={32} />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div
                                //className={styles.formContent}
                                id="questionchat"
                                style={{
                                    paddingTop: "20px",
                                    paddingLeft: "10px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    flexDirection: "column"
                                }}
                                className={styles.questionchat}
                            >
                                {/*/here*/}
                                <div className={styles.boxAnswer} style={{ maxHeight: "100vh", paddingTop: "25px", overflowY: "scroll", paddingRight: "10px" }}>
                                    {answers.map((answer, index) => (
                                        <div key={index}>
                                            <UserChatMessage message={answer[0]} />
                                            <div className={styles.chatMessageGpt} ref={chatMessageStreamEnd}>
                                                <Answer
                                                    key={index}
                                                    answer={answer[1]}
                                                    isSelected={selectedAnswer === index && activeAnalysisPanelTab !== undefined}
                                                    onCitationClicked={c => onShowCitation(c, index)}
                                                    onThoughtProcessClicked={() => onToggleTab(AnalysisPanelTabs.ThoughtProcessTab, index)}
                                                    onSupportingContentClicked={() => onToggleTab(AnalysisPanelTabs.SupportingContentTab, index)}
                                                    onFollowupQuestionClicked={q => makeApiRequest(q)}
                                                    showFollowupQuestions={useSuggestFollowupQuestions && answers.length - 1 === index}
                                                    playsound={isSoundOn}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <>
                                            <UserChatMessage message={lastQuestionRef.current} />
                                            <div className={styles.chatMessageGptMinWidth}>
                                                <AnswerLoading />
                                            </div>
                                        </>
                                    )}
                                    {error ? (
                                        <>
                                            <UserChatMessage message={lastQuestionRef.current} />
                                            <div className={styles.chatMessageGptMinWidth}>
                                                <AnswerError error={error.toString()} onRetry={() => makeApiRequest(lastQuestionRef.current)} />
                                            </div>
                                        </>
                                    ) : null}

                                    <div />
                                </div>

                                <div
                                    style={{
                                        position: "sticky",
                                        bottom: 0,
                                        /*paddingTop: '15px',*/
                                        background: "white"
                                    }}
                                    className={styles.wrapInputs}
                                >
                                    <ClearChatButton
                                        className={styles.commandButtonDelete}
                                        onClick={clearChat}
                                        disabled={!lastQuestionRef.current || isLoading}
                                    />

                                    <QuestionInput
                                        clearOnSend
                                        placeholder="Digite a sua Pergunta"
                                        disabled={isLoading}
                                        onSend={question => makeApiRequest(question)}
                                        onListen={handleVoiceInput}
                                        isActive={isActive}
                                    />

                                    <div className={styles.volumeAvatar}>
                                        <div
                                            id="linha 552"
                                            className={styles.volumeMobile}
                                            onClick={() => {
                                                setIsSoundOn(!isSoundOn);
                                                isSoundOn ? setaudiostatus("pause") : setaudiostatus("resume");
                                            }}
                                        >
                                            {isSoundOn ? (
                                                <BsVolumeUpFill style={{ color: "white" }} size={32} />
                                            ) : (
                                                <BsVolumeMuteFill style={{ color: "white" }} size={32} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {answers.length > 0 && activeAnalysisPanelTab && (
                <div className={styles.AnalisesPanel}>
                    <AnalysisPanel
                        className={styles.chatAnalysisPanel}
                        activeCitation={activeCitation}
                        onActiveTabChanged={x => onToggleTab(x, selectedAnswer)}
                        citationHeight="810px"
                        answer={answers[selectedAnswer][1]}
                        activeTab={activeAnalysisPanelTab}
                        setActiveAnalysisPanelTab={closeAnalysisPanel}
                    />
                </div>
            )}
            {/* </div> */}
        </div>
    );
};

export default Chat;
