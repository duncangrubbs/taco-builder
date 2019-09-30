import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';
import store from './store';

// React Components
import TacoBuilder from './components/TacoBuilder';
import Taco from './components/Taco';

import './styles/global.css';

/**
 * Base React component, UI container for the app.
 */
class App extends Component {
  constructor() {
    super();

    this.state = {
      tacos: [],
    }

    this.handleStateChange = this.handleStateChange.bind(this);
  }

  componentDidMount() {
    store.subscribe(this.handleStateChange);
  }

  /**
   * Handles Redux state change
   * Updates the local state to match the global state
   * if they are different
   */
  handleStateChange() {
    const globalState = store.getState();

    // if no tacos have been built, let the
    // number of tacos in global state be 0
    let length = 0;
    if (globalState.tacos) {
      length = globalState.tacos.length;
    }
    // if a taco has been added or removed, update the
    // component's state
    if (length < this.state.tacos.length) {
      this.setState(previousState => ({
        tacos: [...previousState.tacos, globalState.tacos[length - 1]]
      }));
    } else {
      this.setState({ tacos: globalState.tacos });
    }
  }

  render() {
    return (
      <div id="app">
        <h1 className="header-1">Taco Builder</h1>
        <TacoBuilder />
        <h2 className="header-2">Your Tacos</h2>
        {this.state.tacos.map((taco, index) => (
          <Taco
            baseLayers={taco.baseLayers}
            mixins={taco.mixins}
            seasonings={taco.seasonings}
            condiments={taco.condiments}
            shells={taco.shells}
            key={index}
            id={taco.id}
          />
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  state,
});

export default connect(mapStateToProps, {})(App);
