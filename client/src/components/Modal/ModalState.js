/** Represents state of a modal component. This object
 *  is immutable and exposes methods to create new ModalState
 *  objects derived from this object.
 */
function ModalState(visible, text, title) {
    this.visible = visible || false;
    this.title = title || '';
    this.text = text || '';

    Object.freeze(this);
}

ModalState.prototype.show = function (text, title) {
    return new ModalState(true, text || this.text, title || this.title);
}

ModalState.prototype.hide = function () {
    return new ModalState(false, this.text, this.title);
}

export default ModalState;