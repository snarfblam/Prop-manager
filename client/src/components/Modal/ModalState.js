import React from 'react';

/** Represents state of a modal component. This object
 *  is immutable and exposes methods to create new ModalState
 *  objects derived from this object.
 */
/**
 * @constructor
 * @prop {boolean} visible - Indicates whether the modal will be visible on the page
 * @prop {any} content - React component to display inside the modal
 * @prop {string} title - Title to display for the modal
 */
function ModalState(visible, content, title, fixed) {
    this.visible = visible || false;
    this.title = title || '';
    this.content = content || (<p />);
    this.fixed = fixed || false; // should be true or false, not undefined

    Object.freeze(this);
}

ModalState.prototype.show = function (content, title, fixed) {
    var newFixed = fixed;
    if (newFixed === undefined) newFixed = this.fixed;
    return new ModalState(true, content || this.content, title || this.title, newFixed);
}

ModalState.prototype.hide = function () {
    return new ModalState(false, this.content, this.title);
}

export default ModalState;