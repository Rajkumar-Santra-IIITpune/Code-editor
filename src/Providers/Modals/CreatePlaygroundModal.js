import { useContext } from "react"
import "./createPlaygroundModal.scss"
import { ModalContext } from "../ModalProvider"
import { PlaygroundContext } from "../PlaygroundProvider";


export const CreatePlaygroundModal = ()=>{
    const modalFeatures = useContext(ModalContext);
    const playgroundFeatures = useContext(PlaygroundContext);
    const closeModal = () =>{
        modalFeatures.closeModal();

    };

    const onSubmitModal = (e) =>{
      e.preventDefault();
      
      // Check if we're adding to an existing folder
      if (modalFeatures.modalPayload && modalFeatures.modalPayload.folderId) {
        const folderId = modalFeatures.modalPayload.folderId;
        const fileName = e.target.fileName.value;
        const language = e.target.language.value;
        playgroundFeatures.createNewFile(folderId, fileName, language);
      } else {
        // Creating a new folder with a file
        const folderName = e.target.folderName.value;
        const fileName = e.target.fileName.value;
        const language = e.target.language.value;
        playgroundFeatures.createNewPlayground({
          folderName,
          fileName,
          language,
        });
      }
      closeModal();
    }
    
    // Check if we're adding to an existing folder
    const isAddingToExistingFolder = modalFeatures.modalPayload && modalFeatures.modalPayload.folderId;

    return <div className="modal-container">
           <form className="modal-body" onSubmit = {onSubmitModal}>
                 <span onClick={closeModal} className="material-icons close">close</span>
                 <h1>{isAddingToExistingFolder ? "Add New Card" : "Create New Playground"}</h1>
                 
                 {!isAddingToExistingFolder && (
                   <div className="item">
                      <p>Enter folder Name</p>
                      <input name="folderName" required={!isAddingToExistingFolder}/>
                   </div>
                 )}
                 
                 <div className="item">
                    <p>Enter card Name</p>
                    <input name="fileName" required/>
                 </div>
                 <div className="item">
                    <select name="language" required>
                        <option value="c">C</option>
                        <option value="cpp">CPP</option>
                        <option value="rust">Rust</option>
                        <option value="java">Java</option>
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                    </select>

                    <button type="submit">
                        {isAddingToExistingFolder ? "Add Card" : "Create Playground"}
                    </button>
                 </div>
           </form>
    </div>
}
