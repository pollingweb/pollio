import React from 'react'
import Modal from '@mui/material/Modal';
function PollModal() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }
  return (
    <div><Modal
    open={open}
    onClose={handleClose}
    className=""
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <div className="w-full h-full flex justify-center items-center">
    <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="pollId"
              >
                Poll ID
              </label>
              <input id="pollId"/>
              </div>
        </div></Modal></div>
  )
}

export default PollModal