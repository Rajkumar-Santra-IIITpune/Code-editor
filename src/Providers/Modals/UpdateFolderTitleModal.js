import { useContext } from "react"
import "./createPlaygroundModal.scss"
import { ModalContext } from "../ModalProvider"
import { PlaygroundContext } from "../PlaygroundProvider";
import { createFolderStyles} from "./CreateFolderModal";

export const UpdateFolderTitleModal = () =>{
    const {closeModal,modalPayload} = useContext(ModalContext);
    const {editFolderTitle}= useContext(PlaygroundContext);

    const onSubmitModal = (e)=>{
        e.preventDefault();
        const folderName = e.target.folderName.value;
        editFolderTitle(folderName,modalPayload);
        closeModal();
    }

   
     return <div className="modal-container">
         <form className="modal-body" onSubmit={onSubmitModal}>
              <span onClick={closeModal} className="material-icons close">close</span>
                 <h1>Edit Folder Title</h1>
                 <div style={createFolderStyles.inputContainer}>
                    <input required name="folderName" style={createFolderStyles.input} placeholder="Enter folder name" />
                    <button style={createFolderStyles.btn} type="submit">Edit Folder</button>
                 </div>
         </form>
     </div>
}