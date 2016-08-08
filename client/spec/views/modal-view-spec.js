import ModalView from '../../src/views/modal-view';
import Config from '../../src/config';
import Backbone from 'backbone';

describe('Modal View', () => {

  let modalView = null;
  const testTemplate = '<div class="Modal">Test</div>';
  const testData = { test: 'lol' };
  const mockConfig = new Config({
    uid: 'bencentra',
    cn: 'Ben Centra',
    hostUrl: 'http://localhost:8888',
    apiUrl: 'http://localhost:3000/v1',
  });
  const mockModel = new Backbone.Model({
    config: mockConfig,
  });

  beforeEach(() => {
    modalView = new ModalView({ model: mockModel });
    modalView.template = jasmine.createSpy('template').and.returnValue(testTemplate);
  });

  it('can be constructed', () => {
    expect(modalView).toBeDefined();
    expect(modalView.model).toEqual(mockModel);
  });

  describe('render', () => {

    beforeEach(() => {
      spyOn(modalView, 'delegateEvents');
    });

    it('renders the template', () => {
      modalView.render(testData);
      expect(modalView.template).toHaveBeenCalled();
      expect(modalView.el.innerHTML).toEqual(testTemplate);
      expect(modalView.delegateEvents).toHaveBeenCalled();
    });

    it('initializes the Bootstrap modal', () => {
      modalView.render(testData);
      expect(modalView.$modal).toBeDefined();
      expect($.fn.modal).toHaveBeenCalledWith({ show: false });
    });

    it('returns the view for chaining', () => {
      const result = modalView.render(testData);
      expect(result).toEqual(modalView);
    });

  });

  describe('modal methods', () => {

    beforeEach(() => {
      modalView.render();
    });

    it('show() shows the modal', () => {
      modalView.show();
      expect($.fn.modal).toHaveBeenCalledWith('show');
    });

    it('hide() hides the modal', () => {
      modalView.hide();
      expect($.fn.modal).toHaveBeenCalledWith('hide');
    });

    it('toggle() toggles the modal', () => {
      modalView.toggle();
      expect($.fn.modal).toHaveBeenCalledWith('toggle');
    });

  });

});
