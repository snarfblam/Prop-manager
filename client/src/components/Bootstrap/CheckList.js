/* 
    CheckList - list of checkboxes

    Example:
        // in constructor
        this.checkList = [
            {name: 'a', label: 'A'},
            {name: 'b', label: 'B'},
            {name: 'c', label: 'C (checked by default)', checked: true},
        ];
        this.state.checkValues = new CheckListState(this.checkList);

        // in JSX
        <CheckList 
            items={this.checkList} 
            state={this.state.checkValues} 
            stateChange={(newState) => this.setState({
                checkValues: newState
            })}
        />

    Props: 
        items: {
            name: string        - input name
            label: string       - displayed text
            checked?: boolean   - default value
        } []    
        inline?: any            - if true, items will be displayed inline
        state: {...values}      - a CheckListState object with a boolean property named after each item
        stateChanged: function()- called when this object's state is changed, passing a single parameter: a CheckListState.
 */

import React from 'react';

export default props => {
    console.log(props.inline);
    var className = props.inline ? 'form-check form-check-inline' : 'frm-check';
    var state = props.state;
    return (
        <div>
            {props.items.map((item, i) => (
                <div className={className} key={i}>
                    <label>
                        <input
                            type='checkbox'
                            name={item.name}
                            value={props.state[item.name] || false}
                            onChange={(e) => { props.stateChanged(state.setValue(item.name, e.target.value)) }}
                        /> {item.label}
                    </label>
                </div>
            ))}
        </div>
    );
};


/** @constructor 
 * Immutable object represeting
*/
function CheckListState(itemList, changedName, changedValue) {
    if (itemList.constructor == CheckListState) {
        // Create a CheckListState object that is a modified version of the one passed in
        Object.assign(this, itemList);
        this[changedName] = changedValue;
    } else {
        // Create a new CheckListState object from a list of {name, label, checked}  objects.
        itemList.forEach(item => {
            this[item.name] = item.checked || false;
        });

    }
} {
    CheckListState.prototype.setValue = function (name, value) {
        return new CheckListState(this, name, value);
    }
}


export { CheckListState };