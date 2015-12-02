import React, { Component, PropTypes } from 'react';

export default class BikesList extends Component {
    static propTypes = {
        bikes: PropTypes.object.isRequired,
        addBike: PropTypes.func.isRequired
    };

    render() {
        const { generalSettings } = this.props;
        const enablePushNotifications = generalSettings.get('EnableActivityPushNotifications');

        return (<form>
            <Checkbox name="EnableActivityPushNotifications" label="Enable Activity Push Notifications"
                value={enablePushNotifications ? enablePushNotifications.get('Value') : null}
                description={enablePushNotifications ? enablePushNotifications.get('Description') : null}
                onChange={::this.onElementValueChanged} />

            <button onClick={::this.onSave}>Save</button>
        </form>);
    }

    onSave(e) {
        e.preventDefault();
        this.props.save(this.props.enterpriseId, this.props.generalSettings);
    }

    onElementValueChanged(val) {
        this.props.settingChanged(val.name, val.value);
    }
}
