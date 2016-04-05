import ToolbarView from '../../src/views/toolbar';
import MapEvents from '../../src/events';

describe('ToolbarView', () => {

  let toolbarView = null;

  beforeEach(() => {
    toolbarView = new ToolbarView();
  });

  it('can be constructed', () => {
    expect(toolbarView).toBeDefined();
    expect(toolbarView.events).toBeDefined();
    expect(typeof toolbarView.template).toEqual('function');
  });

  describe('render()', () => {

    it('renders the view', () => {
      const result = toolbarView.render();
      expect(result).toEqual(toolbarView);
      expect(toolbarView.el.innerHTML).toBeDefined();
    });

  });

  describe('events', () => {

    beforeEach(() => {
      toolbarView.render();
      spyOn(MapEvents, 'trigger');
    });

    it('listens for clicks on the search button', () => {
      toolbarView.$el.find('a.toolbar-search').trigger('click');
      expect(MapEvents.trigger).toHaveBeenCalledWith('search');
    });

    it('listens for clicks on the info button', () => {
      toolbarView.$el.find('a.toolbar-info').trigger('click');
      expect(MapEvents.trigger).toHaveBeenCalledWith('info');
    });

  });

});
