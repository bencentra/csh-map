import InfoView from '../../src/views/info';
import InfoModel from '../../src/models/info';
import ModalView from '../../src/views/modal-view';
import MapModel from '../../src/models/map';
import ReasonCollection from '../../src/collections/reasons';
import Config from '../../src/config';
import Backbone from 'backbone';
import Q from 'q';

describe('InfoView', () => {

  let infoView = null;
  const mockConfig = new Config({
    uid: 'bencentra',
    cn: 'Ben Centra',
    hostUrl: 'http://localhost:8888',
    apiUrl: 'http://localhost:3000/v1'
  });
  const mockMap = new MapModel({
    config: mockConfig
  });
  mockMap.set('reasons', new ReasonCollection([
    {id: 1, name: 'Not Specified', description: ''},
    {id: 2, name: 'Specified!', description: ''}
  ]));
  const mockModel = new InfoModel({
    config: mockConfig,
    map: mockMap
  });
  mockModel.set({
    member: new Backbone.Model({
      uid: 'bencentra',
      cn: 'Ben Centra'
    }),
    location: new Backbone.Model({
      id: 1,
      address: 'Boston, MA, USA'
    }),
    record: new Backbone.Model({
      LocationId: 1,
      MemberUid: 'bencentra'
    }),
    reason: 1,
    city: 'Boston',
    state: 'MA',
    country: 'USA'
  });

  beforeEach(() => {
    infoView = new InfoView({ model: mockModel });
  });

  it('can be constructed', () => {
    expect(infoView).toBeDefined();
    expect(infoView.events).toBeDefined();
    expect(typeof infoView.template).toEqual('function');
  });

  describe('render()', () => {

    beforeEach(() => {
      spyOn(infoView.model, 'loadDataFromMap');
      spyOn(ModalView.prototype, 'render').and.callThrough();
    });

    it('loads data from the model', () => {
      infoView.render();
      expect(infoView.model.loadDataFromMap).toHaveBeenCalled();
    });

    it('renders the view', () => {
      const result = infoView.render();
      expect(ModalView.prototype.render).toHaveBeenCalledWith(infoView.model.toJSON());
      expect(result).toEqual(infoView);
    });

  });

  describe('events', () => {

    beforeEach(() => {
      spyOn(infoView.model, 'loadDataFromMap');
      spyOn(infoView.model, 'updateAddress').and.returnValue(Q(true));
      spyOn(infoView.model, 'removeFromMap').and.returnValue(Q(true));
      infoView.render();
    });

    it('listens for keyup events on the city text box', () => {
      const $cityInput = infoView.$('.city-input');
      $cityInput.val('Denver');
      expect(infoView.model.get('city')).toEqual('Boston');
      $cityInput.trigger('keyup');
      expect(infoView.model.get('city')).toEqual('Denver');
      expect(infoView.model.updateAddress).not.toHaveBeenCalled();
      $cityInput.trigger($.Event('keyup', { which: 13 }));
      expect(infoView.model.updateAddress).toHaveBeenCalled();
    });

    it('listens for keyup events on the state text box', () => {
      const $stateInput = infoView.$('.state-input');
      $stateInput.val('CO');
      expect(infoView.model.get('state')).toEqual('MA');
      $stateInput.trigger('keyup');
      expect(infoView.model.get('state')).toEqual('CO');
      expect(infoView.model.updateAddress).not.toHaveBeenCalled();
      $stateInput.trigger($.Event('keyup', { which: 13 }));
      expect(infoView.model.updateAddress).toHaveBeenCalled();
    });

    it('listens for keyup events on the country text box', () => {
      const $countryInput = infoView.$('.country-input');
      $countryInput.val('US');
      expect(infoView.model.get('country')).toEqual('USA');
      $countryInput.trigger('keyup');
      expect(infoView.model.get('country')).toEqual('US');
      expect(infoView.model.updateAddress).not.toHaveBeenCalled();
      $countryInput.trigger($.Event('keyup', { which: 13 }));
      expect(infoView.model.updateAddress).toHaveBeenCalled();
    });

    it('listens for change events on the reason select', () => {
      const $reasonInput = infoView.$('.reason-input');
      $reasonInput.val(2);
      expect(infoView.model.get('reason')).toEqual(1);
      $reasonInput.trigger('change');
      expect(infoView.model.get('reason')).toEqual(2);
    });

    // TODO: figure out promises, test eventual MapEvents calls
    it('listens for click events on the submit button', () => {
      infoView.$('.submit-button').trigger('click');
      expect(infoView.model.updateAddress).toHaveBeenCalled();
    });

    // TODO: figure out promises, test eventual MapEvents calls
    it('listens for click events on the remove button', () => {
      infoView.$('.remove-button').trigger('click');
      expect(infoView.model.removeFromMap).toHaveBeenCalled();
    });

  });

});
