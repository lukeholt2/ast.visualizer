import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import FileUpload from '../fileUpload/fileDrop';
import { ASTService } from './astService';
import { container } from 'tsyringe';


interface INavProps{
  
}

interface INavState{
  collapsed: boolean;
  hasData: boolean;
}

export class NavMenu extends Component<INavProps, INavState> {
  static displayName = NavMenu.name;

  uploadDialog: React.RefObject<FileUpload>;

  astService: ASTService;

  constructor(props: INavProps) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = { collapsed: true, hasData: false };
    this.uploadDialog = React.createRef();
    this.astService = container.resolve<ASTService>(ASTService)
    
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }
  componentDidMount(): void {
    this.astService.currentData.subscribe(data => this.setState({hasData: data !== null}));
  }

  render() {
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" container light>
          <NavbarBrand tag={Link} to="/">AST.Visualizer</NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
            <ul className="navbar-nav flex-grow">
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink style={{ cursor: 'pointer' }} className="text-dark" onClick={() => this.uploadDialog?.current?.open()}>Upload
                </NavLink>
              </NavItem>
              {this.state.hasData && 
              <NavItem>
                <NavLink style={{ cursor: 'pointer' }} className="text-dark" onClick={() => this.astService.clear()}>
                  Clear
                </NavLink>
              </NavItem>}
            </ul>
          </Collapse>
        </Navbar>
        <FileUpload ref={this.uploadDialog} OnUpload={(files: (string | Blob)[]) => this.upload(files)}></FileUpload>
      </header>
    );
  }

  upload(files: (string | Blob)[]) {
    this.astService.parse(files[0]);
  }

}
