import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';

interface ILayoutProps{
  children?: React.ReactElement<any> | React.ReactElement<any>[];
}

export class Layout extends Component<ILayoutProps> {
  static displayName = Layout.name;

  render() {
    return (
      <div>
        <NavMenu />
        <Container>
          {this.props.children}
        </Container>
      </div>
    );
  }
}
