import React from 'react';
import ReactDOM from 'react-dom';
import Taco from '../components/Taco';
import { Provider } from 'react-redux';

import store from '../store';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <Taco
        baseLayers={["sample"]}
        mixins={["sample"]}
        seasonings={["sample"]}
        condiments={["sample"]}
        shells={["sample"]}
        id={12345}
        />
    </Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});
