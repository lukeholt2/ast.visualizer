import React from 'react';
import { container } from 'tsyringe';
import Treemap from '../treemap';
import { ASTService } from './astService';


export class Home extends React.Component<any, any> {
  
  astService: ASTService;

  constructor(props: any) {
    super(props);
    this.state = { data: null }
    this.astService = container.resolve<ASTService>(ASTService);
  }

  componentDidMount(): void {
      this.astService.currentData.subscribe(data => this.setState({ data: data }));
  }

  render() {
    return (
      <div>{this.state.data == null 
          ? <label>No AST Data loaded</label>
          : <Treemap treeData={this.state.data}></Treemap>
        }
      </div>
    );
  }
}
