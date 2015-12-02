import React, { Component } from 'react';
import { createStore, applyMiddleware, bindActionCreators, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { Router, Route, IndexRoute } from 'react-router';
import masterReducer from '../reducers/';
import Bikes from './Bikes.jsx';
import Navigation from '../components/Navigation.jsx';

const finalCreateStore = compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);
const store = finalCreateStore(masterReducer, __INITIALSTATE__);

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <Route path="/" component={AppShell}>
                        <IndexRoute component={Bikes} />
                        <Route path="bikes" component={Bikes} />
                    </Route>
                </Router>
            </Provider>
        );
    }
}

class AppShell extends Component {
    render() {
        return (
            <div>
                <Navigation />
                {this.props.children}
            </div>
        );
    }
}
