import React from "react";
import ReactDom from "react-dom";

require('./sass/styles.sass');


var recipies = JSON.parse(localStorage.getItem('_ysajid_recipes'));

if(recipies == null) {
    recipies = [
        {
            "name" : "Empty Box",
            "description" : "",
            "items" : ","
        }
    ];
    localStorage.setItem('_ysajid_recipes', JSON.stringify(recipies));
}

// class Modal extends React.Component {

// }

class Recipe extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "collapsed" : false,
            "items" : props.items.split(",")
        }
    }

    edit(e, id) {
        ReactDom.render(<RecipeModal
                    isOpen = {true}
                    isNew = {false}
                    title={this.props.title}
                    description={this.props.description}
                    items={this.props.items}/>, 
                    document.getElementById("global-modal"));
    }

    render() {
        return(
            <div className="recipe panel panel-primary" >
                <div className="panel-heading" data-toggle="collapse" href={"#item"+this.props.id} data-parent="#recipies">
                    <h2 className="panel-title text-inline"> {this.props.name} : <small className="text-muted">{this.props.description}</small></h2>
				</div>
                <div id={"item"+this.props.id} className="panel-collapse collapse">
                    <ul className="list-group" >
                        {this.state.items.map(function(item, i){
                            return (
                                <li className="list-group-item">{item}</li>
                            );
                        })}
                        <div className="btn-holder btn-toolbar" role="toolbar">
                            <input type="button" className="btn btn-sm btn-primary pull-right" onClick={this.edit.bind(this,this.props.id)} value="Edit" />
                            <input type="button" className="btn btn-sm btn-danger pull-right" value="Delete" />
                        </div>
                    </ul>
                </div>
            </div>
        );
    }
}

class RecipeModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "isOpen" : true
        }
    }


    render() {
        if(this.state.isOpen)
            return (
                <div className="modal fade">
                    <div className="modal-dialog">
                        <form className="modal-content" onSubmit={this.props.save}>
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                <h4 className="modal-title">Recipe</h4>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label class="control-label" for="r_name">Recipe Name</label>
                                    <input class="form-control" id="r_name" type="text" required placeholder="Awesome recipe..." value={this.props.title}/>
                                </div>
                                <div className="form-group">
                                    <label class="control-label" for="r_desc">Description</label>
                                    <input class="form-control" id="r_desc" type="text" placeholder="You'll love it..." value={this.props.description}/>
                                </div>
                                <div className="form-group">
                                    <label class="control-label" for="r_items">Items needed</label>
                                    <input class="form-control" id="r_items" type="text" required placeholder="items in comma-separated form..." value={this.props.items}/>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <input type="button" className="btn btn-default" data-dismiss="modal" value="Close"/>
                                <input type="submit" className="btn btn-primary" value={this.props.isNew ? "Add" : "Save changes"}/>
                            </div>
                        </form>
                    </div>
                </div> 
            )
        else
            return null;
    }
}

class RecipeBox extends React.Component {

    constructor () {
        super()
        var newModal = {
            "isOpen" : false,
            "isNew" : true
        }

        this.state = {
            "recipies" : recipies,
            "modalstate" : newModal
        }

        this.save = this.save.bind(this);
    }

    save(event) {
        var name = document.getElementById("r_name").value;
        var description = document.getElementById("r_desc").value;
        var items = document.getElementById("r_items").value;
        if(name && items) {
            // if(this.state.modalstate.isNew){
                recipies.push({
                    name : name,
                    description : description,
                    items : items
                })
                console.log("pushed");
                localStorage.setItem('_ysajid_recipes', JSON.stringify(recipies));
            // }
        }

        $("#recipe-modal").modal("hide");
        this.setState({
            recipies : recipies
        })
        event.preventDefault();
    }

    edit(event, id) {
        this.setState({
            modalstate : {
                isOpen : true,
                isNew : false,
                title : recipies[id].title,
                description : recipies[id].description,
                items : recipies[id].items
            }
        })
    }

    render() {
        return (
            <div id="recipies" className="panel-group col-md-offset-2 col-md-8 col-lg-offset-3 col-lg-6">
                <RecipeModal 
                    isOpen={this.state.modalstate.isOpen} 
                    isNew={this.state.modalstate.isNew} 
                    title={this.state.modalstate.title}
                    description={this.state.modalstate.description}
                    items={this.state.modalstate.items}
                    save={this.save} />

                {this.state.recipies.map(function(recipe, i) {
                    return (
                        <Recipe
                            name={recipe.name}
                            items={recipe.items}
                            description = {recipe.description}
                            id={i}/>
                    );
                })}

                <input type="button" class="btn btn-warning pull-right btn-add fa fa-plus" value="&#xf067;" data-toggle="modal" data-target="#recipe-modal"/>
            </div>
        );
    }
}

const app = document.getElementById("app");

ReactDom.render(<RecipeBox/>, app);
