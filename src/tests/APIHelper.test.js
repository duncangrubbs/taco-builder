import APIHelper from '../APIHelper';

it('runs without crashing', () => {
  function callback(data) {
    expect(data).toHaveLength(28);
  }

  APIHelper.fetchDataFromEndpoint('baseLayers')
  .then((data) => callback(data));
});
