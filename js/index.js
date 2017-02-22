"use strict";

var Grid = ReactBootstrap.Grid,
    Row = ReactBootstrap.Row,
    Col = ReactBootstrap.Col,
    Well = ReactBootstrap.Well,
    Accordion = ReactBootstrap.Accordion,
    Panel = ReactBootstrap.Panel,
    Button = ReactBootstrap.Button,
    ButtonToolbar = ReactBootstrap.ButtonToolbar,
    Modal = ReactBootstrap.Modal,
    ListGroup = ReactBootstrap.ListGroup,
    ListGroupItem = ReactBootstrap.ListGroupItem,
    FormControl = ReactBootstrap.FormControl,
    ControlLabel = ReactBootstrap.ControlLabel;

var RecipeContainer = React.createClass({
  displayName: "RecipeContainer",
  getInitialState: function getInitialState() {
    if (!localStorage.getItem('_hadaclay_recipes')) {
      var recipes = [{
        name: "Peanut Brittle",
        ingredients: "Peanuts, butter, water, sugar, salt"
      }, {
        name: "Cheesecake",
        ingredients: "Graham cracker crumbs, sugar, butter or margerine, cream cheese, sugar, eggs"
      }];
      localStorage.setItem('_hadaclay_recipes', JSON.stringify(recipes));
      return { recipes: recipes };
    } else {
      // Get Recipes from LocalStorage
      var recipes = JSON.parse(localStorage.getItem('_hadaclay_recipes'));
      return { recipes: recipes };
    }
  },
  handleNew: function handleNew(recipe) {
    var newState = {};
    newState.recipes = this.state.recipes;
    newState.recipes.push(recipe);
    this.setState(newState);
    localStorage.setItem('_hadaclay_recipes', JSON.stringify(this.state.recipes));
  },
  handleUpdate: function handleUpdate(event, key) {
    var newState = {};
    newState = this.state.recipes[key];
    switch (event.target.id) {
      case 'recipe-name':
        newState.name = event.target.value;
        this.setState(newState);
        localStorage.setItem('_hadaclay_recipes', JSON.stringify(this.state.recipes));
        break;
      case 'ingredients':
        newState.ingredients = event.target.value;
        this.setState(newState);
        localStorage.setItem('_hadaclay_recipes', JSON.stringify(this.state.recipes));
        break;
      default:
        break;
    }
  },
  handleDelete: function handleDelete(key) {
    var newState = {};
    newState.recipes = this.state.recipes;
    newState.recipes.splice(key, 1);
    this.setState(newState);
    localStorage.setItem('_hadaclay_recipes', JSON.stringify(this.state.recipes));
  },
  render: function render() {
    var _this = this;

    return React.createElement(
      Well,
      { className: "recipe-well" },
      this.state.recipes.map(function (recipe, i) {
        return React.createElement(
          RecipePanel,
          { eventKey: i, key: i, header: recipe.name,
            onUpdate: _this.handleUpdate,
            onDelete: _this.handleDelete },
          recipe.ingredients
        );
      }),
      React.createElement(AddRecipeModal, { onNew: this.handleNew })
    );
  }
});

var RecipePanel = React.createClass({
  displayName: "RecipePanel",
  getInitialState: function getInitialState() {
    return {
      showModal: false
    };
  },
  closeEditModal: function closeEditModal() {
    this.setState({
      showModal: false
    });
  },
  openEditModal: function openEditModal() {
    this.setState({
      showModal: true
    });
  },
  handleChange: function handleChange(event, key) {
    this.props.handleUpdate(event, key);
  },
  handleSubmit: function handleSubmit(event) {
    event.preventDefault();
  },
  handleDelete: function handleDelete() {
    this.props.onDelete(this.props.eventKey);
  },
  render: function render() {
    var _this2 = this;

    return React.createElement(
      "div",
      null,
      React.createElement(
        Panel,
        { header: this.props.header, eventKey: this.props.eventKey, collapsible: true },
        React.createElement(
          "h4",
          { className: "text-center" },
          "Ingredients"
        ),
        React.createElement("hr", null),
        React.createElement(
          ListGroup,
          null,
          this.props.children.split(',').map(function (ingredient, i) {
            return React.createElement(
              ListGroupItem,
              { key: i },
              " ",
              ingredient
            );
          })
        ),
        React.createElement(
          ButtonToolbar,
          null,
          React.createElement(
            Button,
            { onClick: this.handleDelete, bsStyle: "danger" },
            "Delete"
          ),
          React.createElement(
            Button,
            { onClick: this.openEditModal },
            "Edit Recipe"
          )
        )
      ),
      React.createElement(
        Modal,
        { show: this.state.showModal, onHide: this.closeEditModal },
        React.createElement(
          Modal.Header,
          { closeButton: true },
          React.createElement(
            Modal.Title,
            null,
            "Edit Recipe"
          )
        ),
        React.createElement(
          Modal.Body,
          null,
          React.createElement(
            "form",
            { onSubmit: this.handleSubmit },
            React.createElement(
              ControlLabel,
              null,
              "Recipe"
            ),
            React.createElement(FormControl, { id: "recipe-name",
              value: this.props.header,
              onChange: function onChange(event) {
                return _this2.props.onUpdate(event, _this2.props.eventKey);
              } }),
            React.createElement(
              ControlLabel,
              null,
              "Ingredients"
            ),
            React.createElement(FormControl, { id: "ingredients",
              componentClass: "textarea",
              value: this.props.children,
              onChange: function onChange(event) {
                return _this2.props.onUpdate(event, _this2.props.eventKey);
              } })
          )
        ),
        React.createElement(
          Modal.Footer,
          null,
          React.createElement(
            ButtonToolbar,
            { className: "pull-right" },
            React.createElement(
              Button,
              { bsStyle: "primary", onClick: this.closeEditModal },
              "Finish"
            )
          )
        )
      )
    );
  }
});

var AddRecipeModal = React.createClass({
  displayName: "AddRecipeModal",
  getInitialState: function getInitialState() {
    return {
      showModal: false,
      name: '',
      ingredients: ''
    };
  },
  close: function close() {
    this.setState({
      showModal: false
    });
  },
  open: function open() {
    this.setState({
      showModal: true
    });
  },
  onChange: function onChange(event) {
    switch (event.target.id) {
      case 'recipe-name':
        this.setState({ name: event.target.value });
        break;
      case 'ingredients':
        this.setState({ ingredients: event.target.value });
        break;
      default:
        break;
    }
  },
  handleSubmit: function handleSubmit(event) {
    event.preventDefault();
    // Build object from state
    var newRecipe = {
      name: this.state.name,
      ingredients: this.state.ingredients
    };
    this.props.onNew(newRecipe);
    // Clear state after passed to RecipeContainer
    this.setState({ name: '', ingredients: '' });
    this.close();
  },
  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        Button,
        { className: "add-button", bsSize: "large", bsStyle: "primary", block: true, onClick: this.open },
        "Add Recipe"
      ),
      React.createElement(
        Modal,
        { show: this.state.showModal, onHide: this.close },
        React.createElement(
          Modal.Header,
          { closeButton: true },
          React.createElement(
            Modal.Title,
            null,
            "Add a Recipe"
          )
        ),
        React.createElement(
          Modal.Body,
          null,
          React.createElement(
            "form",
            { onSubmit: this.handleSubmit },
            React.createElement(
              ControlLabel,
              null,
              "Recipe"
            ),
            React.createElement(FormControl, { id: "recipe-name", placeholder: "Recipe Name", value: this.state.name, onChange: this.onChange }),
            React.createElement(
              ControlLabel,
              null,
              "Ingredients"
            ),
            React.createElement(FormControl, { id: "ingredients", componentClass: "textarea",
              placeholder: "Enter, ingredients, separated, by, commas",
              value: this.state.ingredients, onChange: this.onChange })
          )
        ),
        React.createElement(
          Modal.Footer,
          null,
          React.createElement(
            ButtonToolbar,
            { className: "pull-right" },
            React.createElement(
              Button,
              { onClick: this.handleSubmit, bsStyle: "primary" },
              "Add Recipe"
            ),
            React.createElement(
              Button,
              { onClick: this.close },
              "Close"
            )
          )
        )
      )
    );
  }
});

var App = function App() {
  return React.createElement(
    Grid,
    null,
    React.createElement(
      Row,
      null,
      React.createElement(
        Col,
        { xs: 12 },
        React.createElement(RecipeContainer, null)
      )
    )
  );
};

ReactDOM.render(React.createElement(App, null), document.getElementById('app'));

// Set background of page
var deviceHeight = window.screen.height;
var deviceWidth = window.screen.width;
document.body.style.backgroundImage = "url(https://source.unsplash.com/category/food/" + deviceWidth + "x" + deviceHeight + ")";