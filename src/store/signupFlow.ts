import { create } from 'zustand';

interface SignupFlowState {
  phone: string | null;
  signupToken: string | null;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  goal: 'BUY' | 'EARN' | null;
  set: (patch: Partial<Omit<SignupFlowState, 'set' | 'reset'>>) => void;
  reset: () => void;
}

const INITIAL: Omit<SignupFlowState, 'set' | 'reset'> = {
  phone: null,
  signupToken: null,
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  goal: null,
};

export const useSignupFlow = create<SignupFlowState>((set) => ({
  ...INITIAL,
  set: (patch) => set(patch),
  reset: () => set(INITIAL),
}));
