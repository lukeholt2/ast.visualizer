import React from 'react'

interface IDragProps{
    text: string;
    handleDrop?: any;
    children?: React.ReactElement<any> | React.ReactElement<any>[];
}

interface IDragState extends IDragProps{
    drag: boolean;
}

export default class DragAndDrop extends React.Component<IDragProps, IDragState> {

    dragCounter: number = 0;
    
    constructor(props: Readonly<{ text: string, handleDrop?: any, children?: any[] }>){
        super(props);
        this.state = { 
            drag: false, 
            text: props.text, 
            handleDrop: props.handleDrop
        }
    }

    handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }

    handleDragIn = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        this.dragCounter++
        if (e.dataTransfer && e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            this.setState({ drag: true })
        }
    }

     handleDragOut = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        this.dragCounter--
        if (this.dragCounter === 0) {
            this.setState({ drag: false })
        }
    } 

     handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        this.setState({ drag: false })
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            if(this.state.handleDrop) { this.state.handleDrop(e.dataTransfer.files); }
            this.dragCounter = 0
        }
        this.setState({text: ''});
    }


    render() {
        return (
            <div
                onDragEnter={this.handleDragIn.bind(this)}
                onDragLeave={this.handleDragOut.bind(this)}
                onDragOver={this.handleDrag.bind(this)}
                onDrop={this.handleDrop.bind(this)}
            >
                <div style={baseStyle}>
                    <div style={draggedStyle}>
                        <div style={{top:'30%', position: 'relative'}}>{this.state.text}</div>
                    </div>
                </div>
                {this.props.children}
            </div>
        )
    }
}

const baseStyle = {
    position: 'absolute',
    right: 0,
    left: 0,
    top: '30%',
    bottom: '20%',
    textAlign: 'center',
    color: 'grey',
    fontSize: 36,
} as React.CSSProperties;

const draggedStyle = {
    border: 'dashed grey 4px',
    backgroundColor: 'rgba(255,255,255,.8)',
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    height: '90%'
} as React.CSSProperties;