const Grid = ReactBootstrap.Grid,
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

class RecipeContainer extends React.Component {
  constructor(props) {
    super(props);
    if (localStorage.getItem('_hadaclay_recipes') === null) {
      let recipes = [
      {
        name: 'Peanut Brittle',
        ingredients: 'Peanuts, butter, water, sugar, salt' },

      {
        name: 'Cheesecake',
        ingredients: 'Graham cracker crumbs, sugar, butter or margerine, cream cheese, sugar, eggs' }];


      localStorage.setItem('_hadaclay_recipes', JSON.stringify(recipes));
      this.state = { recipes };
    } else {
      // Get Recipes from LocalStorage
      let recipes = JSON.parse(localStorage.getItem('_hadaclay_recipes'));
      this.state = { recipes };
    }

    this.handleNew = this.handleNew.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleNew(recipe) {
    let newState = {};
    newState.recipes = this.state.recipes;
    newState.recipes.push(recipe);
    this.setState(newState);
    localStorage.setItem(
    '_hadaclay_recipes',
    JSON.stringify(this.state.recipes));

  }

  handleUpdate(event, key) {
    let newState = {};
    newState = this.state.recipes[key];
    switch (event.target.id) {
      case 'recipe-name':
        newState.name = event.target.value;
        this.setState(newState);
        localStorage.setItem(
        '_hadaclay_recipes',
        JSON.stringify(this.state.recipes));

        break;
      case 'ingredients':
        newState.ingredients = event.target.value;
        this.setState(newState);
        localStorage.setItem(
        '_hadaclay_recipes',
        JSON.stringify(this.state.recipes));

        break;
      default:
        break;}

  }

  handleDelete(key) {
    let newState = {};
    newState.recipes = this.state.recipes;
    newState.recipes.splice(key, 1);
    this.setState(newState);
    localStorage.setItem(
    '_hadaclay_recipes',
    JSON.stringify(this.state.recipes));

  }

  render() {
    return (
      React.createElement(Well, { className: "recipe-well" },
      this.state.recipes.map((recipe, i) => {
        return (
          React.createElement(RecipePanel, {
            eventKey: i,
            key: i,
            header: recipe.name,
            onUpdate: this.handleUpdate,
            onDelete: this.handleDelete },

          recipe.ingredients));


      }),
      React.createElement(AddRecipeModal, { onNew: this.handleNew })));


  }}
;

class RecipePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false };

    this.closeEditModal = this.closeEditModal.bind(this);
    this.openEditModal = this.openEditModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  closeEditModal() {
    this.setState({
      showModal: false });

  }

  openEditModal() {
    this.setState({
      showModal: true });

  }

  handleChange(event, key) {
    this.props.handleUpdate(event, key);
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  handleDelete() {
    this.props.onDelete(this.props.eventKey);
  }

  render() {
    return (
      React.createElement("div", null,
      React.createElement(Panel, {
        header: this.props.header,
        eventKey: this.props.eventKey,
        collapsible: "true" },

      React.createElement("h4", { className: "text-center" }, "Ingredients"), React.createElement("hr", null),
      React.createElement(ListGroup, null,
      this.props.children.split(',').map((ingredient, i) => {
        return React.createElement(ListGroupItem, { key: i }, " ", ingredient);
      })),

      React.createElement(ButtonToolbar, null,
      React.createElement(Button, { onClick: this.handleDelete, bsStyle: "danger" }, "Delete"),
      React.createElement(Button, { onClick: this.openEditModal }, "Edit Recipe"))),



      React.createElement(Modal, { show: this.state.showModal, onHide: this.closeEditModal },
      React.createElement(Modal.Header, { closeButton: true },
      React.createElement(Modal.Title, null, "Edit Recipe")),

      React.createElement(Modal.Body, null,
      React.createElement("form", { onSubmit: this.handleSubmit },
      React.createElement(ControlLabel, null, "Recipe"),
      React.createElement(FormControl, {
        id: "recipe-name",
        value: this.props.header,
        onChange: (event) =>
        this.props.onUpdate(event, this.props.eventKey) }),

      React.createElement(ControlLabel, null, "Ingredients"),
      React.createElement(FormControl, {
        id: "ingredients",
        componentClass: "textarea",
        value: this.props.children,
        onChange: (event) =>
        this.props.onUpdate(event, this.props.eventKey) }))),



      React.createElement(Modal.Footer, null,
      React.createElement(ButtonToolbar, { className: "pull-right" },
      React.createElement(Button, { bsStyle: "primary", onClick: this.closeEditModal }, "Finish"))))));







  }}


class AddRecipeModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      name: '',
      ingredients: '' };


    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  close() {
    this.setState({
      showModal: false });

  }

  open() {
    this.setState({
      showModal: true });

  }

  onChange(event) {
    switch (event.target.id) {
      case 'recipe-name':
        this.setState({ name: event.target.value });
        break;
      case 'ingredients':
        this.setState({ ingredients: event.target.value });
        break;
      default:
        break;}

  }

  handleSubmit(event) {
    event.preventDefault();
    // Build object from state
    const newRecipe = {
      name: this.state.name,
      ingredients: this.state.ingredients };

    this.props.onNew(newRecipe);
    // Clear state after passed to RecipeContainer
    this.setState({ name: '', ingredients: '' });
    this.close();
  }

  render() {
    return (
      React.createElement("div", null,
      React.createElement(Button, {
        className: "add-button",
        bsSize: "large",
        bsStyle: "primary",
        block: true,
        onClick: this.open }, "Add Recipe"),



      React.createElement(Modal, { show: this.state.showModal, onHide: this.close },
      React.createElement(Modal.Header, { closeButton: true },
      React.createElement(Modal.Title, null, "Add a Recipe")),

      React.createElement(Modal.Body, null,
      React.createElement("form", { onSubmit: this.handleSubmit },
      React.createElement(ControlLabel, null, "Recipe"),
      React.createElement(FormControl, {
        id: "recipe-name",
        placeholder: "Recipe Name",
        value: this.state.name,
        onChange: this.onChange }),

      React.createElement(ControlLabel, null, "Ingredients"),
      React.createElement(FormControl, {
        id: "ingredients",
        componentClass: "textarea",
        placeholder: "Enter, ingredients, separated, by, commas",
        value: this.state.ingredients,
        onChange: this.onChange }))),



      React.createElement(Modal.Footer, null,
      React.createElement(ButtonToolbar, { className: "pull-right" },
      React.createElement(Button, { onClick: this.handleSubmit, bsStyle: "primary" }, "Add Recipe"),


      React.createElement(Button, { onClick: this.close }, "Close"))))));





  }}


function App() {
  return (
    React.createElement(Grid, null,
    React.createElement(Row, null,
    React.createElement(Col, { xs: 12 },
    React.createElement(RecipeContainer, null)))));




}

ReactDOM.render(React.createElement(App, null), document.getElementById('app'));

// Set background of page
const deviceHeight = document.documentElement.clientHeight;
const deviceWidth = document.documentElement.clientWidth;
document.body.style.backgroundImage = `url(https://source.unsplash.com/collection/197345/${deviceWidth}x${deviceHeight})`;