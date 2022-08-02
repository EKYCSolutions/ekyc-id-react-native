import React, { Component } from 'react';
import { findNodeHandle } from 'react-native';

import { Language } from '../models/Language';
import type { DocumentScannerResult } from './DocumentScannerResult';
import { DocumentScannerDocType } from './DocumentScannerValues';

import { DocumentScanner, DocumentScannerController, RefType } from './DocumentScanner';
import type { DocumentScannerOptions } from './DocumentScannerOptions';

type DocumentScannerViewProps = {
    language: Language;
    documentTypes: [DocumentScannerDocType];
    onDocumentScanned: (
        mainSide: DocumentScannerResult,
        secondarySide?: DocumentScannerResult,
    ) => Promise<void>;
    options: DocumentScannerOptions;
};

type DocumentScannerEvent = {
    type: String,
    value?: any,
}


export class DocumentScannerView extends Component<DocumentScannerViewProps> {
    public static defaultProps = {
        language: Language.EN,
        documentTypes: [DocumentScannerDocType.NATIONAL_ID],
        options: {
            preparingDuration: 2,
        }
    };

    private ref: React.RefObject<RefType> | null = null;


    constructor(props: DocumentScannerViewProps) {
        super(props);
    }

    private handle = () => {
        const nodeHandle = findNodeHandle(this.ref!!.current);
        if (nodeHandle == null || nodeHandle === -1) {
            throw "Could not get the Camera's native view tag! Does the Camera View exist in the native view-tree?";
        }

        return nodeHandle;
    }

    private onInitialized = () => {
        console.log("onInitialized")
    }

    private onDetection = (result: DocumentScannerResult) => {
        console.log(result)
    }

    private onFrame = (frame: String) => {
        console.log(frame)
    }

    private onEvent = (event: DocumentScannerEvent) => {
        if (event.type == "onInitialize") {
            this.onInitialized();
        } else if (event.type == "onFrame") {
            this.onFrame(event.value);
        } else if (event.type == "onDetection") {
            this.onDetection(event.value);
        }
    }

    private onCreated = async (ref: React.RefObject<RefType>) => {
        console.log("onCreated")
        this.ref = ref;
        DocumentScannerController.start(
            this.handle(),
            this.props.options,
            this.onEvent,
        )
        // await DocumentScannerController.start(
        //     this.props.options,
        //     this.onInitialized,
        //     this.onDetection,
        //     this.onFrame,
        // )
    }

    public render(): React.ReactNode {
        return (
            <DocumentScanner
                onCreated={this.onCreated}
            />
            // <View style={{ flex: 1, backgroundColor: "blue", }}>
            //     <DocumentScanner
            //         onCreated={this.onCreated}
            //     />
            // </View>
        )
    }
}