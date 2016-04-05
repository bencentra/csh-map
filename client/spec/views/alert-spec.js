import AlertView from '../../src/views/alert';

describe('AlertView', () => {

  let alertView = null;
  const testData = {
    type: 'success',
    message: 'Test Message LOL!'
  };

  beforeEach(() => {
    alertView = new AlertView();
  });

  it('can be constructed', () => {
    expect(alertView).toBeDefined();
    expect(typeof alertView.template).toEqual('function');
    expect(alertView.data).toBeDefined();
  });

  describe('render()', () => {

    beforeEach(() => {
      alertView.data = testData;
    });

    it('renders the view', () => {
      const result = alertView.render();
      expect(result).toEqual(alertView);
      expect(alertView.el.innerHTML).toBeDefined();
    });

  });

  describe('setData()', () => {

    it('sets the view\'s data property', () => {
      alertView.setData(testData.type, testData.message);
      expect(alertView.data).toEqual(testData);
    });

  });

});
