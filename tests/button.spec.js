var React = require('react-with-addons');
var TestUtils = React.addons.TestUtils;
var ButtonComponent = require('../src/button')

describe('ButtonComponent', () => {
    it('renders without a problem', () => {
        var button = TestUtils.renderIntoDocument(<ButtonComponent />);
        expect(button).toBeDefined();
    });
});