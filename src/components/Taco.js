import React, { Component } from 'react';
import propTypes from 'prop-types';

import { connect } from 'react-redux';
import { removeTaco } from '../actions/removeTaco';

import '../styles/taco.css';

/**
 * The UI and logic behind
 * and individual taco displayed in the list.
 */
class Taco extends Component {
  constructor() {
    super();

    this.removeTaco = this.removeTaco.bind(this);
  }

  removeTaco() {    
    this.props.removeTaco({ tacoID: this.props.id });
  }

  /**
   * Returns a formated string describing
   * a taco based on its attributes.
   */
  constructDescription() {
    let mixins = '';
    let condiments = '';
    this.props.mixins.forEach((mixin) => {
      mixins += `${mixin}, `;
    });
    this.props.condiments.forEach((condiment, index) => {
      if (index === this.props.condiments.length - 1) {
        condiments += `and ${condiment}`;
      } else {
        condiments += `${condiment}, `;
      }
    });
    const toppings = `${mixins}${condiments}`;
    const shellAndBase = `
      Two ${this.props.shells[0]}
      layered with ${this.props.seasonings[0]} 
      seasoned ${this.props.baseLayers[0]}`;
    return `${shellAndBase} and topped with ${toppings}.`.replace(/\(([^)]+)\)/g, '');
  }

  render() {
    return (
      <div className="taco">
        {this.constructDescription()}
        <button
          className="button--standard"
          onClick={this.removeTaco}
          >X
        </button>
      </div>
    );
  }
}

// Props validation
Taco.propTypes = {
  baseLayers: propTypes.array.isRequired,
  mixins: propTypes.array.isRequired,
  seasonings: propTypes.array.isRequired,
  condiments: propTypes.array.isRequired,
  shells: propTypes.array.isRequired,
  id: propTypes.number.isRequired,
};

const mapStateToProps = state => ({
  state,
});

export default connect(mapStateToProps, { removeTaco })(Taco);