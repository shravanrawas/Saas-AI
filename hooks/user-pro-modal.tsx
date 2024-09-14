import {create} from 'zustand';

interface userpromodalstore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void; 
}

export const userpromodal = create<userpromodalstore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
}))