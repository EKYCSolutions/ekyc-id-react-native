import {
  requireNativeComponent,
  NativeModules,
  DeviceEventEmitter,
  NativeMethods
} from 'react-native';
import React, { PureComponent } from 'react';

type DocumentScannerProps = {
  onCreated: (ref: React.RefObject<RefType>) => void;
};

const NativeDocumentScanner = requireNativeComponent("DocumentScanner")

export const DocumentScannerController = NativeModules.DocumentScanner;

export type RefType = React.Component<DocumentScannerProps> & Readonly<NativeMethods>;


export class DocumentScanner extends PureComponent<DocumentScannerProps> {
  private readonly ref: React.RefObject<RefType>;

  constructor(props: DocumentScannerProps) {
    super(props);
    this.ref = React.createRef<RefType>();
    DeviceEventEmitter.addListener('onCreated', (event: any) => {
      this.props.onCreated(this.ref)
    })
  }

  public render(): React.ReactNode {
    return (
      <NativeDocumentScanner ref={this.ref} />
    )
  }
}