import { createContext, useEffect, useState } from "react";
import {v4} from 'uuid';




export const PlaygroundContext = createContext();
const initialData = [
    {
        id: v4(),
        title: 'DSA',
        files:[
            {
                id: v4(),
                title: 'index',
                code: `#include <iostream>
                       using namespace std;

                       int main() {
                       cout << "Hello, World!";
                       return 0;
                    }`,
                language: 'cpp',
            }
        ]
    },
     {
        id: v4(),
        title: 'Frontend',
        files:[
            {
                id: v4(),
                title: 'test',
                code: 'console.log("Hello world");',
                language: 'javascript',
            }
        ]
    },

]

const defaultCodes={
    'c': `#include <stdio.h>

int main() {
    printf("Hello, World!");
    return 0;
}`,
    'cpp': `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!";
    return 0;
}`,
    'rust': `fn main() {
    println!("Hello, World!");
}`,
    'javascript': `console.log("Hello, World!");`,
    'python': `print("Hello, World!")`,
    'java': `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
}
export const PlaygroundProvider = ({children}) =>{
    const [folders,setFolders] = useState(()=>{
       const localData= localStorage.getItem('data');
       if(localData) {
        return JSON.parse(localData);
       }
       return initialData;
    });
    
    const [currentFile, setCurrentFile] = useState(null);
    const [currentFolderId, setCurrentFolderId] = useState(null);

    const createNewPlayground = (newPlayground) =>{
        const {fileName,folderName,language} = newPlayground;
        const newFolders = [...folders];

        newFolders.push({
            id: v4(),
            title: folderName,
            files: [
                {
                    id: v4(),
                    title: fileName,
                    code: defaultCodes[language],
                    language,
                }
            ]
        })
        localStorage.setItem('data',JSON.stringify(newFolders));
        setFolders(newFolders);

    }
    
    const createNewFile = (folderId, fileName, language) => {
        const newFolders = [...folders];
        const folderIndex = newFolders.findIndex(folder => folder.id === folderId);
        
        if (folderIndex !== -1) {
            newFolders[folderIndex].files.push({
                id: v4(),
                title: fileName,
                code: defaultCodes[language],
                language,
            });
            
            localStorage.setItem('data', JSON.stringify(newFolders));
            setFolders(newFolders);
        }
    }

    const createNewFolder = (folderName) =>{
        const newFolder = {
            id: v4(),
            title: folderName,
            files: []
        }

        const allFolders = [...folders,newFolder];
     
       localStorage.setItem('data',JSON.stringify(allFolders));
       setFolders(allFolders);
    }

    const deleteFolder = (id) =>{
      const updatedFoldersList=  folders.filter((folderItem)=>{
        return folderItem.id !== id ;
       });
       localStorage.setItem('data',JSON.stringify(updatedFoldersList));
       setFolders(updatedFoldersList);
    }

    const editFolderTitle = (newFolderName,id) =>{
       const updatedFoldersList= folders.map((folderItem)=>{
           if(folderItem.id === id){
               folderItem.title= newFolderName;
           }
           return folderItem;
        })
        localStorage.setItem('data',JSON.stringify(updatedFoldersList));
        setFolders(updatedFoldersList);
    }

    const editFileTitle = (newFileName, folderId,fileId)=>{
        const copiedFolders = [...folders];
        for(let i=0;i<copiedFolders.length;i++) {
            if(folderId === copiedFolders[i].id) {
                const files = copiedFolders[i].files;
                for(let j=0;j<files.length;j++){
                    if(files[j].id === fileId){
                         files[j].title= newFileName;
                         break;
                    }
                }
                break;

            }
        }

        localStorage.setItem('data',JSON.stringify(copiedFolders));
        setFolders(copiedFolders);
        
    }
    
    const deleteFile = (folderId, fileId) => {
        const copiedFolders = [...folders];
        for(let i=0;i<copiedFolders.length;i++) {
            if(folderId === copiedFolders[i].id) {
                const files = copiedFolders[i].files;
                for(let j=0;j<files.length;j++){
                    if(files[j].id === fileId){
                         files.splice(j, 1);
                         break;
                    }
                }
                break;
            }
        }
        
        localStorage.setItem('data',JSON.stringify(copiedFolders));
        setFolders(copiedFolders);
    }
    
    const selectFile = (folderId, fileId) => {
        const folder = folders.find(f => f.id === folderId);
        if (folder) {
            const file = folder.files.find(f => f.id === fileId);
            if (file) {
                setCurrentFile({...file, folderId});
                setCurrentFolderId(folderId);
            }
        }
    }
    
    const updateFileContent = (folderId, fileId, newCode) => {
        const copiedFolders = [...folders];
        for(let i=0;i<copiedFolders.length;i++) {
            if(folderId === copiedFolders[i].id) {
                const files = copiedFolders[i].files;
                for(let j=0;j<files.length;j++){
                    if(files[j].id === fileId){
                         files[j].code = newCode;
                         break;
                    }
                }
                break;
            }
        }
        
        localStorage.setItem('data',JSON.stringify(copiedFolders));
        setFolders(copiedFolders);
        
        // Update current file if it's the one being edited
        if (currentFile && currentFile.id === fileId && currentFolderId === folderId) {
            setCurrentFile({...currentFile, code: newCode});
        }
    }

    useEffect(()=>{
        if(!localStorage.getItem('data'))
              localStorage.setItem('data',JSON.stringify(folders));
    },[])

    const playgroundFeatures = {
        folders,
        currentFile,
        createNewPlayground,
        createNewFolder, 
        createNewFile,
        deleteFolder, 
        editFolderTitle,
        editFileTitle,
        deleteFile,
        selectFile,
        updateFileContent
    }

   
    return (
       <PlaygroundContext.Provider value={playgroundFeatures}>
           {children}
       </PlaygroundContext.Provider>
    );
}
