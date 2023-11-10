import React, { Component } from 'react'
import {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogContent,
    DialogFooter,
} from "@react-md/dialog";
import { Button } from "@react-md/button";
import DragAndDrop from './dragDrop'

interface IUploadProps {
    title?: string;
    OnUpload: any;
}

interface IUploadState extends IUploadProps {
    files: File[];
    isVisible: boolean;
}

export default class FileUpload extends Component<IUploadProps, IUploadState> {

    // TODO: Add the following:
    //      1. File type restrictions
    //      2. # of files limit

    constructor(props: IUploadProps) {
        super(props);
        const title = props.title ? props.title : "File Upload";
        this.state = { title: title, files: [], isVisible: false, OnUpload: props.OnUpload }
    }

    handleDrop = (files: string | any[] | FileList | null) => {
        if(!files) return;
        let fileList = this.state.files
        for (var i = 0; i < files.length; i++) {
            if (!files[i].name) return
            fileList.push(files[i])
        }   
        this.setState({ files: fileList })
    }

    open() {
        this.setState({ isVisible: true });
    }

    close() {
        this.setState({ isVisible: false, files: [] });
    }

    render() {
        return (
            <Dialog aria-labelledby="file-upload" id="dialog" visible={this.state.isVisible} style={dialogStyle} onRequestClose={() => this.setState({ isVisible: false })}>
                <DialogHeader>
                    <DialogTitle id="dialog-title">{this.state.title}</DialogTitle>
                </DialogHeader>
                <DialogContent>
                
                    <DragAndDrop text="Drop it!" handleDrop={this.handleDrop}>
                    <input type="file" style={fileDropStyle}
                         onChange={(e) => this.handleDrop(e.target.files)}/>
                        <div>
                            {this.state.files.map((file, idx) =>
                                <div key={idx}>{file.name}</div>
                            )}
                        </div>
                        
                    </DragAndDrop>
                </DialogContent>
                <DialogFooter>
                    <Button id="dialog-upload"
                        disabled={this.state.files.length === 0}
                        onClick={() => { this.props.OnUpload(this.state.files); this.close() }}>
                        Upload
                    </Button>
                    <Button id="dialog-close" onClick={() => this.close()}>
                        Close
                    </Button>
                </DialogFooter>
            </Dialog>);
    }

}

const dialogStyle = {
    position: 'relative',
    textAlign: 'center',
    height: '35vh',
    width: '20vw'

} as React.CSSProperties;

const fileDropStyle = {
    zIndex: 1000,
    position: 'absolute',
    opacity: 0,
    width: '100%',
    top: '30%',
    left: 0,
    right: 0,
    height: '45%'
    
} as React.CSSProperties;