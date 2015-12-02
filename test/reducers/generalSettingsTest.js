import expect from 'expect';
import Immutable, { Map } from 'immutable';
import generalSettings from '../../../src/js/enterpriseConfig/reducers/generalSettings';
import * as Actions from '../../../src/js/enterpriseConfig/constants/GeneralConstants';

describe('generalSettings reducer', () => {
    it('should return the initial state', () => {
        expect(
            generalSettings(undefined, {})
        ).toBe(Map({}));
    });

    it('should merge settings on fetch', () => {
        const state = generalSettings(undefined, {
            type: Actions.FETCH_GENERAL_SUCCESS,
            payload: {
                'SOME_KEY_BOOL': { Value: true, Updated: false },
                'SOME_KEY_STR': { Value: 'foo', Updated: false }
            }
        });
        expect(state.size).toBe(2);
        expect(state.get('SOME_KEY_BOOL').get('Value')).toBe(true);
        expect(state.get('SOME_KEY_STR').get('Value')).toBe('foo');
    });

    it('should update settings on setting changed', () => {
        const initState = Immutable.fromJS({
            'SOME_KEY_BOOL': { Value: true, Updated: false },
            'SOME_KEY_STR': { Value: 'foo', Updated: false }
        });
        const state = generalSettings(initState, {
            type: Actions.SETTING_CHANGED,
            payload: {
                name: 'SOME_KEY_STR',
                value: 'bar'
            }
        });

        expect(state.size).toBe(2);
        expect(state).toNotBe(initState);
        expect(state.get('SOME_KEY_BOOL').get('Value')).toBe(initState.get('SOME_KEY_BOOL').get('Value'));
        expect(state.get('SOME_KEY_STR').get('Value')).toBe('bar');
    });
});
