/**
 * @overview This is a reference for the different ways to create components.
 * Includes notes on when to use the different variations.
 */


/** non-class expression. (NOT "hoisted")
 * 
 */
const MyComponent = React.createClass({
    getInitialState: function() {
        return {seconds: 0};    
    },
    
    propTypes: {
        
    },

    getDefaultProps() {  // ES6 shortened method syntax
        return {
            value: 'default value'
        };
    },
    
    myMethod: () => {  // ES6 arrow function (binds to "this" scope)
        
    },
    
    componentDidMount: function() {  // pre-ES6. ("this" set by context)
        
    },

    // render: () => (<div></div>),  !! "this" will be undefined.
    render: function() {
        return (<div></div>);
    }
});

/** ES6 class declaration. (Will be "hoisted")
 * Initial state set in constructor.
 * Prop validation and defaults go in constructor or outside class.
 */
class MyComponent extends Component {
    /**
     * Adding constructor is not necessary if it only contains "super".
     */
    constructor(...args) {
        super(...args);
        this.method = this.method.bind(this);
        // Set "state" here or below. Don't use "getInitialState" in a class
        this.state = {count: props.initialCount};
    }
    
    static need = [Action.request]  // MERN.io server-side preloading of data.

    /** ES7 allows adding props and state properties here.
     * Requires "babel-preset-stage-0"
     * Using "constructor" becomes unnecessary
     * Bind "this" with arrow functions.
     */
      
    static defaultProps = {  // ES7 only!
        // ES7 Static method or define within constructor or externally
    }
    
    static propTypes = {  // ES7 only!
        // ES7 Static method or define within constructor or externally
    }
    
    state = {  // ES7 only!
        // InitialState here or within constructor
    }
    
    /**
     * Bind method to "this" in the constructor.
     */
    method(obj) {
        
    }
    
    methodES7 = (obj) => {  // ES7 only! Binds "this" to MyComponent instance
        
    }
    
    
    render() {
        // Do some minor changes or renaming here. Keep things "pure" / idempotent.
        const props = this.props;
        // Either parenthesis "(" or opening <tag> must follow "return".
        return (  
            <div>
            
            </div>
        );
    }
}
// Externally (before or after class) or in constructor or as static methods.
MyComponent.propTypes = {}  // Ensure incoming types are acceptable.
MyComponent.defaultProps = {}  // Default values if any prop is not received.



/** STATELESS FUNCTIONS below
 * No internal state or lifecycle methods.
 * Just supply props and go
 */

/** ES5 Function DECLARATION: (Will be "hoisted")
 * Basic format. 
 * Allows putting propTypes and defaultProps before function (hoisting).
 */
function MyComponent(props) {
    /**
     * Optionally do stuff before returning component.
     */ 
    
    return (<div></div>);
}

/** ES6 Function EXPRESSION: (NOT "hoisted")
 * Basic component just relying on props. 
 */
const MyComponent = (props) =>
<div></div>

/** ES6 Function EXPRESSION: (NOT "hoisted")
 * Do more with curly braces.
 */
const MyComponent = (props) => {
    /**
     * Optionally do stuff before returning component.
     */
    
    return <div></div>
};

// Externally.
MyComponent.propTypes = {};  // Ensure incoming types are acceptable.
MyComponent.defaultProps = {};  // Default values if any prop is not received.
        
        
/**
        Common Errors:
        
"A valid React element (or null) must be returned."
        May have forgotten to use () after a "return"
        
"Warning: React.createElement: type should not be null, undefined, boolean, or number. It should be a string (for DOM elements) or a ReactClass (for composite components). Check the render method of `ShipmentTemplates`.
Invariant Violation: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object. Check the render method of `ShipmentTemplates`."
        May have forgotten to "export" a component from its file.
        
**/