import React from "react";
import {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogContent,
    DialogFooter,
} from "@react-md/dialog";
import { Button } from "@react-md/button";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'

export interface ICodeDialogProp
{
    code?:string; 
    language?: string;
}

export interface ICodeDialogState extends ICodeDialogProp
{
    code: string;
    isVisible: boolean;
}

export default class CodeDialog extends React.Component<ICodeDialogProp, ICodeDialogState> {

    constructor(props : ICodeDialogProp) {
        super(props);
        this.state = { isVisible: false, code: '', language: '' };
    }

    setVisible(code: string, language: string) {
        console.log('here')
        this.setState({ isVisible: !this.state.isVisible, code: code, language: language });
    }

    render() {
        return (
            <Dialog aria-labelledby="code-dialog" id="dialog"
             visible={this.state.isVisible} style={{ maxWidth: "75vw"}}  
             onRequestClose={() => this.setState({ isVisible: false })}>
                <DialogHeader>
                    <DialogTitle id="dialog-title">Code of Interest</DialogTitle>
                </DialogHeader>
                <DialogContent>
                    <pre>
                        <SyntaxHighlighter wrapLines={true} wrapLongLines={true} 
                        language={this.state.language} style={darcula} PreTag="div" 
                        children={this.state.code} />
                    </pre>
                </DialogContent>
                <DialogFooter>
                    <Button id="dialog-close" onClick={() => this.setState({ isVisible: false })}>
                        Close
                    </Button>
                </DialogFooter>
            </Dialog>);
    }
}