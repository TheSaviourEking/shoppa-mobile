import { create } from 'zustand';

export interface PostItemDraft {
  clientId: string;
  name: string;
  imageUri: string | null;
  imageMime: string | null;
}

export type InstalmentsCount = 1 | 2 | 3;

interface PostFlowState {
  categoryId: string | null;
  categoryName: string | null;
  items: PostItemDraft[];
  note: string;
  budget: string;
  instalments: InstalmentsCount;
  deliveryAddress: string;
  setCategory: (id: string, name: string) => void;
  addItem: (item: Omit<PostItemDraft, 'clientId'>) => void;
  removeItem: (clientId: string) => void;
  setNote: (note: string) => void;
  setBudget: (budget: string) => void;
  setInstalments: (count: InstalmentsCount) => void;
  setDeliveryAddress: (address: string) => void;
  reset: () => void;
}

const INITIAL: Omit<
  PostFlowState,
  | 'setCategory'
  | 'addItem'
  | 'removeItem'
  | 'setNote'
  | 'setBudget'
  | 'setInstalments'
  | 'setDeliveryAddress'
  | 'reset'
> = {
  categoryId: null,
  categoryName: null,
  items: [],
  note: '',
  budget: '',
  instalments: 1,
  deliveryAddress: '',
};

export const usePostFlow = create<PostFlowState>((set) => ({
  ...INITIAL,
  setCategory: (id, name) => set({ categoryId: id, categoryName: name }),
  addItem: (item) =>
    set((s) => ({
      items: [...s.items, { ...item, clientId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }],
    })),
  removeItem: (clientId) => set((s) => ({ items: s.items.filter((i) => i.clientId !== clientId) })),
  setNote: (note) => set({ note }),
  setBudget: (budget) => set({ budget }),
  setInstalments: (count) => set({ instalments: count }),
  setDeliveryAddress: (address) => set({ deliveryAddress: address }),
  reset: () => set(INITIAL),
}));
