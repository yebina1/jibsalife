import './PostMoreSheet.css'
import AddSheet from './AddSheet'
import Button from './html/Button'

type PostMoreSheetProps = {
  type: 'own' | 'other'
  onClose: () => void
  onDelete: () => void
  onEdit: () => void
}

function PostMoreSheet({ type, onClose, onDelete, onEdit }: PostMoreSheetProps) {
  return (
    <AddSheet onClose={onClose}>
      <ul className="post_more_sheet_list">
        {type === 'own' ? (
          <>
            <li><button type="button" onClick={onDelete}>삭제하기</button></li>
            <li><button type="button" onClick={onEdit}>수정하기</button></li>
          </>
        ) : (
          <>
            <li><button type="button" className="post_more_sheet_disabled" disabled>차단하기</button></li>
            <li><button type="button" className="post_more_sheet_disabled" disabled>신고하기</button></li>
          </>
        )}
      </ul>
      <Button type="button" className="purple_btn post_more_sheet_close" onClick={onClose}>
        닫기
      </Button>
    </AddSheet>
  )
}

export default PostMoreSheet
