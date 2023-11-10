import { Component, createRef } from 'react';
import * as d3 from 'd3';
import CodeDialog from './codeDialog';

interface ITreeProps {
  treeData: any;
  language?: string;
}

export default class Treemap extends Component<ITreeProps, ITreeProps> {

  private svgRef: React.RefObject<any>;
  private codeDialogRef: React.RefObject<any>;

  constructor(props: ITreeProps) {
    super(props);
    this.state = { treeData: props.treeData, language: props.language ?? "csharp" }
    this.svgRef = createRef();
    this.codeDialogRef = createRef();
  }

  Tree(data: { children: any }) {

    const linkTarget = "_blank";
    const width = 1200;
    const radius = 4;
    const padding = 2;
    const fill = "#999";
    const stroke = "#555";
    const strokeWidth = 1.5;
    const strokeOpacity = 1;
    const halo = "#fff";
    const haloWidth = 4;

    const root: d3.HierarchyNode<any> = d3.hierarchy(data, d => d.children).sort((a: any, b: any) => d3.descending(a.height, b.height));

    // Compute the layout.
    const dx = 12;
    const dy = width / (root.height + padding);
    d3.tree().nodeSize([dx, dy])(root);

    // Center the tree.
    let x0 = width;
    let x1 = -x0;
    root.each((d: any) => {
      if (d.x > x1) x1 = d.x;
      if (d.x < x0) x0 = d.x;
    });

    // Compute the default height.
    const height = x1 - x0 + dx * 2;

    const svg = d3.select(this.svgRef.current)
      .attr("viewBox", [-dy * padding / 2, x0 - dx, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10);

    svg.append("g")
      .attr("fill", "none")
      .attr("stroke", stroke)
      .attr("stroke-opacity", strokeOpacity)
      .attr("stroke-width", strokeWidth)
      .selectAll("path")
      .data(root.links())
      .join('path')
      .attr("fill", "none")
      .attr("stroke", stroke)
      .attr("stroke-opacity", strokeOpacity)
      .attr("stroke-width", strokeWidth)
      .attr("d", d3.linkHorizontal<any, any>()
        .x(function (d) { return d.y })
        .y(function (d) { return d.x }));

    const node = svg.append("g")
      .selectAll("a")
      .data(root.descendants())
      .join("a")
      .on('click', (d: any) => this.codeDialogRef.current.setVisible(d.target["__data__"].data.text, this.state.language))
      .attr("target", linkTarget)
      .attr("transform", (d: any) => `translate(${d.y},${d.x})`)

    node.append("circle")
      .attr("fill", d => d.children ? stroke : fill)
      .attr("r", radius);

    node.append("text")
      .attr("dy", "1.2em")
      .attr("x", (d: any) => d['children'] ? -6 : 6)
      .attr("text-anchor", (d: any) => d['.children'] ? "end" : "start")
      .attr("paint-order", "stroke")
      .attr("stroke", halo)
      .attr("stroke-width", haloWidth)
      .text((d: any) => d.data.name);

  }

  componentDidMount(): void {
    this.Tree(this.state.treeData);
  }

  render() {
    return (
      <div style={{ position: 'absolute', width: '100vw', height: '90vh', overflow: 'auto' }}>
        <svg ref={this.svgRef}></svg>
        <CodeDialog ref={this.codeDialogRef} key="codeDialog" language={this.state.language}></CodeDialog>
      </div>
    )
  }
}