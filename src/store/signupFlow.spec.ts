import { useSignupFlow } from './signupFlow';

const store = useSignupFlow;

beforeEach(() => {
  store.getState().reset();
});

describe('signupFlow store', () => {
  it('starts with empty strings + null tokens', () => {
    const s = store.getState();
    expect(s.email).toBe('');
    expect(s.signupToken).toBeNull();
    expect(s.firstName).toBe('');
    expect(s.lastName).toBe('');
    expect(s.phone).toBe('');
    expect(s.password).toBe('');
    expect(s.avatarUri).toBeNull();
    expect(s.avatarMime).toBeNull();
    expect(s.goal).toBeNull();
  });

  it('set merges partials without clobbering untouched fields', () => {
    store.getState().set({ email: 'a@b.c' });
    store.getState().set({ signupToken: 'token-1' });
    store.getState().set({ firstName: 'Aidanma', lastName: 'Toluwalope' });

    const s = store.getState();
    expect(s.email).toBe('a@b.c');
    expect(s.signupToken).toBe('token-1');
    expect(s.firstName).toBe('Aidanma');
    expect(s.lastName).toBe('Toluwalope');
  });

  it('set can overwrite a previously stored field', () => {
    store.getState().set({ email: 'a@b.c' });
    store.getState().set({ email: 'x@y.z' });
    expect(store.getState().email).toBe('x@y.z');
  });

  it('reset clears every field back to the initial shape', () => {
    store.getState().set({
      email: 'a@b.c',
      signupToken: 'token-1',
      firstName: 'Aidanma',
      phone: '+2348012345678',
      password: 'hunter2hunter2',
      avatarUri: 'file://x.jpg',
      avatarMime: 'image/jpeg',
      goal: 'BUY',
    });

    store.getState().reset();
    const s = store.getState();
    expect(s.email).toBe('');
    expect(s.signupToken).toBeNull();
    expect(s.phone).toBe('');
    expect(s.password).toBe('');
    expect(s.avatarUri).toBeNull();
    expect(s.goal).toBeNull();
  });
});
