import React from 'react';

/** Represents state of a modal component. This object
 *  is immutable and exposes methods to create new ModalState
 *  objects derived from this object.
 */
/**
 * @constructor
 * @prop {boolean} visible - Indicates whether the modal will be visible on the page
 * @prop {any} contents - React component to display inside the modal
 * @prop {string} title - Title to display for the modal
 */
function ModalState(visible, contents, title) {
    this.visible = visible || false;
    this.title = title || '';
    this.contents = contents || (<p />);

    Object.freeze(this);
}

ModalState.prototype.show = function (contents, title) {
    return new ModalState(true, contents || this.contents, title || this.title);
}

ModalState.prototype.hide = function () {
    return new ModalState(false, this.contents, this.title);
}

export default ModalState;