import * as Actions from '../constants/BikesConstants';

export function addBike(brand, color, bikeType) {
    return {
        type: Actions.ADD_BIKE,
        payload: {
            brand,
            color,
            bikeType
        }
    };
}