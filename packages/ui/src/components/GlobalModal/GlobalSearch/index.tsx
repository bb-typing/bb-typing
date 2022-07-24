import { Modal } from '@nextui-org/react';
import './action-handler';

import { useGloablSearchModalStore } from './store';

interface GlobalSearchModalProps {}

function GlobalSearchModal(props: GlobalSearchModalProps): JSX.Element {
  const { toggleVisible, visible } = useGloablSearchModalStore();

  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      open={visible}
      onClose={toggleVisible}
    >
      <Modal.Header>你好，我是头部</Modal.Header>
      <Modal.Body>我是搜索框…谢谢你…</Modal.Body>
      <Modal.Footer>我是底部呀亲</Modal.Footer>
    </Modal>
  );
}

export default GlobalSearchModal;
