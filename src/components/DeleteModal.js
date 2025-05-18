export default function DeleteModal({close, text, handleDelete,id}) {
    return (
        <div
            className='modal fade'
            tabIndex='-1'
            id='deleteModal'//記得加上ID
            aria-labelledby='exampleModalLabel'
            aria-hidden='true'
        >
            <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header bg-danger'>
                        <h1 className='modal-title text-white fs-5' id='exampleModalLabel'>
                            刪除確認
                        </h1>
                        <button
                            type='button'
                            className='btn-close'
                            aria-label='Close'
                            onClick={close}
                        />
                    </div>
                    <div className='modal-body'>確定要刪除{text}？</div>
                    <div className='modal-footer'>
                        <button type='button' className='btn btn-secondary' onClick={close}>{/*只是直接關掉，沒有參數問題 */}
                            取消
                        </button>
                        <button type='button' className='btn btn-danger' onClick={()=>handleDelete(id)}> {/*我需要傳參數時，要包著一層箭頭函式 */}
                            確認刪除
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}