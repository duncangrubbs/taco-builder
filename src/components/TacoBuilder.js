import React, { Component } from 'react';

import { connect } from 'react-redux';
import { addTaco } from '../actions/addTaco';

import APIHelper from '../APIHelper';

import '../styles/taco-builder.css';

/**
 * The user inerface and functionality 
 * to construct a taco manually or randomly.
 */
class TacoBuilder extends Component {
  constructor() {
    super();

    const categories = [
      'shells',
      'baseLayers',
      'seasonings',
      'mixins',
      'condiments',
    ];

    const ingredientLimits = [
      1,
      1,
      1,
      2,
      3,
    ];

    // for UI purposes
    const categoriesClean = [
      '1 Shell',
      '1 Base Layer',
      '1 Seasoning',
      '1-2 Mixin(s)',
      '1-3 Condiment(s)',
    ];

    this.state = {
      // data from the CT API
      baseLayers: [],
      mixins: [],
      seasonings: [],
      condiments: [],
      shells: [],

      // general state
      activeCategory: 'shells',
      readyToBuild: false,
      categories,
      categoriesClean,
      ingredientLimits,
      choices: new Map(),
    };

    this.selectIngredient = this.selectIngredient.bind(this);
    this.createTaco = this.createTaco.bind(this);
    this.generateRandomTaco = this.generateRandomTaco.bind(this);
    this.updateActiveCategory = this.updateActiveCategory.bind(this);
  }

  componentDidMount() {
    this.getDataFromAPI();
  }

  /**
   * Updates the local state with all the
   * relevant data from the API.
   */
  getDataFromAPI() {
    APIHelper.fetchDataFromEndpoint('baseLayers')
      .then((baseLayers) => {
        baseLayers.splice(13, 1);
        this.setState({ baseLayers });
      });

    APIHelper.fetchDataFromEndpoint('mixins')
      .then((mixins) => {
        this.setState({ mixins });
      });

    APIHelper.fetchDataFromEndpoint('seasonings')
      .then((seasonings) => {
        this.setState({ seasonings });
      });

    APIHelper.fetchDataFromEndpoint('condiments')
      .then((condiments) => {
        this.setState({ condiments });
      });
    
    APIHelper.fetchDataFromEndpoint('shells')
      .then((shells) => {
        this.setState({ shells });
      });
  }

  /**
   * Generates a random taco from the possible ingredients
   * and adds it to the global state.
   */
  generateRandomTaco() {
    const shellIndex = Math.floor((Math.random() * (this.state.shells.length)));
    const baseLayerIndex = Math.floor((Math.random() * (this.state.baseLayers.length)));
    const mixinIndex = Math.floor((Math.random() * (this.state.mixins.length)));
    const seasoningsIndex = Math.floor((Math.random() * (this.state.seasonings.length)));
    const condimentsIndex = Math.floor((Math.random() * (this.state.condiments.length)));

    const ingredientsMap = new Map();
    ingredientsMap.set('baseLayers', [this.state.baseLayers[baseLayerIndex].name]);
    ingredientsMap.set('shells', [this.state.shells[shellIndex].name]);
    ingredientsMap.set('mixins', [this.state.mixins[mixinIndex].name]);
    ingredientsMap.set('seasonings', [this.state.seasonings[seasoningsIndex].name]);
    ingredientsMap.set('condiments', [this.state.condiments[condimentsIndex].name]);

    const taco = this.buildTaco(ingredientsMap);
    
    this.props.addTaco({ taco });
  }

  /**
   * Returns a valid taco object to be added to global state.
   * @param {Map} ingredientsMap Map from category to choice(s).
   */
  buildTaco(ingredientsMap) {
    return {
      baseLayers: ingredientsMap.get('baseLayers'),
      shells: ingredientsMap.get('shells'),
      mixins: ingredientsMap.get('mixins'),
      seasonings: ingredientsMap.get('seasonings'),
      condiments: ingredientsMap.get('condiments'),
    };
  }

  /**
   * Returns the UI list of ingredients for the active category.
   */
  displayActiveCategoryList() {
    return (
      <div>
        <h2 className="header-2">Choose</h2>
        <h3 className="header-3">
          {this.state.categoriesClean[this.state.categories.indexOf(this.state.activeCategory)]}
        </h3>
        <div className="scrolling-section">
          {this.state[this.state.activeCategory].map(option => (
            <div
              onClick={this.selectIngredient}
              className="ingredient"
              id={this.state.activeCategory.slice(0, -1)}
              key={option.slug}>{option.name}
            </div>
          ))}
        </div>
      </div>
    )
  }

  /**
   * Returns the UI list of user's choices to be reviewed.
   * @param {Map} list Map form categories to ingredient choices
   */
  displayReviewList(list) {
    const keys = [...list.keys()];
    const ingredientElementsList = [];
    
    keys.forEach((key) => {
      let choices = list.get(key);
      choices.forEach((choice) => {
        ingredientElementsList.push(
          <div className="ingredient" key={choice}>{choice}</div>
        );
      });
    });
    
    return (
      <div>
        <h2 className="header-2">Review Your Taco</h2>
        <div className="scrolling-section">
          {[...ingredientElementsList]}
        </div>
      </div>
    );
  }

  /**
   * Updates the active category to the next one in
   * the taco building process.
   * If all ingredients have been seleced, it updates
   * the readyToBuild parameter in local state.
   */
  updateActiveCategory() {
    if (!this.state.choices.has(this.state.activeCategory)) {
      return;
    }
    const previousCategoryIndex = this.state.categories.indexOf(this.state.activeCategory);
    if (previousCategoryIndex !== this.state.categories.length - 1) {
      this.setState({ activeCategory: this.state.categories[previousCategoryIndex + 1] });
    } else {
      this.setState({ readyToBuild: true });
    }
  }

  /**
   * Generates the taco object and
   * dispatches the action to add it to
   * the global state.
   */
  createTaco() {
    this.setState({ choices: new Map() });
    this.setState({ activeCategory: 'shells' });
    this.setState({ readyToBuild: false });

    const taco = this.buildTaco(this.state.choices);

    // Dispatch redux action
    this.props.addTaco({ taco });
  }

  /**
   * Decides and executes proper course of action 
   * after a user clicks an ingredient.
   * @param {Object} event onClick event.
   */
  selectIngredient(event) {
    event.persist(); // because the event is synthetic

    const type = this.state.activeCategory;
    const element = event.target;
    const limit = this.state.ingredientLimits[this.state.categories.indexOf(this.state.activeCategory)];
    const previousChoices = this.state.choices;
    const previousChoicesForCategory = previousChoices.get(type) || [];
    const ingredientChoice = event.target.innerHTML;

    if (previousChoicesForCategory.includes(ingredientChoice)) {
      // update UI
      element.classList.remove('ingredient__selected');

      // remove selection
      const indexToRemove = previousChoicesForCategory.indexOf(ingredientChoice);
      previousChoicesForCategory.splice(indexToRemove, 1);
      
      previousChoices.set(type, previousChoicesForCategory);
    } else if (previousChoicesForCategory.length < limit) {
      // update UI
      element.classList.add('ingredient__selected');

      // add to choices map
      previousChoicesForCategory.push(ingredientChoice)
      previousChoices.set(type, previousChoicesForCategory);
    }
    this.setState({ choices: previousChoices });
  }

  render() {
    return (
      <div id="taco-builder">
        {!this.state.readyToBuild && this.displayActiveCategoryList()}
        {this.state.readyToBuild && this.displayReviewList(this.state.choices)}

        {!this.state.readyToBuild && <button
          className="button--standard"
          onClick={this.updateActiveCategory}>Next
        </button>}

        {this.state.readyToBuild && <button
          className="button--standard"
          onClick={this.createTaco}>Build Taco
        </button>}
        <button
          className="button--standard"
          onClick={this.generateRandomTaco}>Random Taco
        </button>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  state,
});

export default connect(mapStateToProps, { addTaco })(TacoBuilder);
