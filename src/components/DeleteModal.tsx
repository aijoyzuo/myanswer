type DeleteModalProps = {
  onClose: () => void;
    text: string;
   handleDelete: (id: string | number) => void;
    id: string | number;
};

export default function DeleteModal({ onClose, text, handleDelete, id }:DeleteModalProps):JSX.Element {
  return (
    <div
      className='modal fade'
      tabIndex={-1}
      id='deleteModal'
      aria-labelledby='exampleModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header bg-danger'>
            <h2 className='modal-title text-white fs-5' id='exampleModalLabel'>
              刪除確認
            </h2>
            <button
              type='button'
              className='btn-close'
              aria-label='Close'
              onClick={onClose}
            />
          </div>
          <div className='modal-body'>確定要刪除{text}？</div>
          <div className='modal-footer'>
            <button type='button' className='btn btn-secondary' onClick={onClose}>{/*只是直接關掉，沒有參數問題 */}
              取消
            </button>
            <button type='button' className='btn btn-danger' onClick={() => handleDelete(id)}> {/*我需要傳參數時，要包著一層箭頭函式 */}
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}