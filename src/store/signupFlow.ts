import { create } from 'zustand';

interface SignupFlowState {
  // Set on the email screen (step 1) and verified via OTP (step 2).
  email: string;
  signupToken: string | null;
  // Profile screen (step 3) collects everything below.
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  avatarUri: string | null;
  avatarMime: string | null;
  goal: 'BUY' | 'EARN' | null;
  set: (patch: Partial<Omit<SignupFlowState, 'set' | 'reset'>>) => void;
  reset: () => void;
}

const INITIAL: Omit<SignupFlowState, 'set' | 'reset'> = {
  email: '',
  signupToken: null,
  firstName: '',
  lastName: '',
  phone: '',
  password: '',
  avatarUri: null,
  avatarMime: null,
  goal: null,
};

export const useSignupFlow = create<SignupFlowState>((set) => ({
  ...INITIAL,
  set: (patch) => set(patch),
  reset: () => set(INITIAL),
}));
