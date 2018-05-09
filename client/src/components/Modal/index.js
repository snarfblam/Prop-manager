/*
    Modal.

    Usage: Place <Modal state={stateVariable}/> on page
    
    Create and store a ModalState object in your component's state object.
    Update as follows from within your component:
        this.setState({
            modalState: this.state.modalState.show('text', 'title')
        });
*/

import Modal from './Modal';
import ModalState from './ModalState';

export default Modal;
export { Modal, ModalState };
