import { Pivot, PivotItem } from "@fluentui/react";
import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";
import styles from "./AnalysisPanel.module.css";

import { SupportingContent } from "../SupportingContent";
import { AskResponse } from "../../api";
import { AnalysisPanelTabs } from "./AnalysisPanelTabs";

interface Props {
    className: string;
    activeTab: AnalysisPanelTabs;
    onActiveTabChanged: (tab: AnalysisPanelTabs) => void;
    activeCitation: string | undefined;
    citationHeight: string;
    answer: AskResponse;
    setActiveAnalysisPanelTab: () => void;
}

const pivotItemDisabledStyle = { disabled: true, style: { color: "grey" } };

export const AnalysisPanel = ({ answer, activeTab, activeCitation, citationHeight, className, onActiveTabChanged, setActiveAnalysisPanelTab }: Props) => {
    const isDisabledThoughtProcessTab: boolean = !answer.thoughts;
    const isDisabledSupportingContentTab: boolean = !answer.data_points.length;
    const isDisabledCitationTab: boolean = !activeCitation;
    const [isMobile, setIsMobile] = useState(false);
    const sanitizedThoughts = DOMPurify.sanitize(answer.thoughts!);
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

    return (
        //<div className={styles.analysisPanelPopupContainer}>/
        <div>
            <div className={`${styles.divTeste}`}>
                <button className={`${styles.btnFechar}`} onClick={setActiveAnalysisPanelTab}>
                    x
                </button>
            </div>

            <div>
                <Pivot
                    styles={styles.divPivot}
                    className={`${className} ${styles.divPivot}`}
                    selectedKey={activeTab}
                    onLinkClick={pivotItem => pivotItem && onActiveTabChanged(pivotItem.props.itemKey! as AnalysisPanelTabs)}
                >
                    <PivotItem
                        itemKey={AnalysisPanelTabs.SupportingContentTab}
                        headerText="Citação"
                        headerButtonProps={isDisabledSupportingContentTab ? pivotItemDisabledStyle : undefined}
                    >
                        <div className={`${styles.cardsResultado}`}>
                            <SupportingContent supportingContent={answer.data_points} />
                        </div>
                    </PivotItem>
                    {/*
                    {!isMobile && (
                        <PivotItem
                            className={styles.divPivot}
                            itemKey={AnalysisPanelTabs.CitationTab}
                            headerText="Fonte"
                            headerButtonProps={isDisabledCitationTab ? pivotItemDisabledStyle : undefined}
                        >
                            <div className={styles.citationContainer}>
                                <iframe title="Fonte" src={activeCitation} className={styles.citationIframe} />
                            </div>
                        </PivotItem>
                    )}
                    */}
                </Pivot>
            </div>
        </div>
    );
};
