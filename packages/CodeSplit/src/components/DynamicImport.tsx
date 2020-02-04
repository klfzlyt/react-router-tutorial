import React from "react";

class DynamicImport extends React.Component<any,any> {
  state = {
    component: null
  };

  componentDidMount() {
    this.props.load().then(component => {      
        this.setState({
          component: component.default ? component.default : component
        });      
    });
  }

  render() {
    return this.props.render(this.state.component);
  }
}

export default DynamicImport;
