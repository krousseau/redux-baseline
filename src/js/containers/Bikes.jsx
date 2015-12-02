import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PureComponent from 'react-pure-render/component';
import * as Actions from '../actionCreators/BikesActionCreators';
import BikesList from '../components/BikesList.jsx';

function selectState(state) {
    return {
        bikes: state.bikes
    };
}

class Bikes extends PureComponent {
    render() {
        const { dispatch, bikes } = this.props;

        return (<div>
            <h2>Bikes</h2>
            <BikesList {...bindActionCreators(Actions, dispatch)}
                bikes={bikes} />
        </div>);
    }
}
export default connect(selectState)(Bikes);
