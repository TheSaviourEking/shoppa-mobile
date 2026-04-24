import { usePostFlow } from './postFlow';

// Access the live store state without needing React — `getState` / `setState`
// are the hook's escape hatch for non-component code.
const store = usePostFlow;

beforeEach(() => {
  store.getState().reset();
});

describe('postFlow store', () => {
  it('starts in an empty/default state', () => {
    const s = store.getState();
    expect(s.categoryId).toBeNull();
    expect(s.categoryName).toBeNull();
    expect(s.items).toEqual([]);
    expect(s.note).toBe('');
    expect(s.budget).toBe('');
    expect(s.instalments).toBe(1);
    expect(s.deliveryAddress).toBeNull();
  });

  it('setCategory stores id + name together', () => {
    store.getState().setCategory('cat-1', 'Grocery');
    expect(store.getState().categoryId).toBe('cat-1');
    expect(store.getState().categoryName).toBe('Grocery');
  });

  it('addItem assigns a unique clientId to every item', () => {
    store.getState().addItem({ name: 'Tomatoes', imageUri: null, imageMime: null });
    store.getState().addItem({ name: 'Tomatoes', imageUri: null, imageMime: null });
    const ids = store.getState().items.map((i) => i.clientId);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
  });

  it('preserves item fields on insert', () => {
    store.getState().addItem({ name: 'Titus Fish', imageUri: 'file://x.jpg', imageMime: 'image/jpeg' });
    const [item] = store.getState().items;
    expect(item.name).toBe('Titus Fish');
    expect(item.imageUri).toBe('file://x.jpg');
    expect(item.imageMime).toBe('image/jpeg');
  });

  it('removeItem filters the matched clientId out', () => {
    store.getState().addItem({ name: 'A', imageUri: null, imageMime: null });
    store.getState().addItem({ name: 'B', imageUri: null, imageMime: null });
    const [, second] = store.getState().items;
    store.getState().removeItem(second.clientId);
    expect(store.getState().items).toHaveLength(1);
    expect(store.getState().items[0].name).toBe('A');
  });

  it('removeItem is a no-op for an unknown clientId', () => {
    store.getState().addItem({ name: 'A', imageUri: null, imageMime: null });
    store.getState().removeItem('does-not-exist');
    expect(store.getState().items).toHaveLength(1);
  });

  it('setNote + setBudget + setInstalments + setDeliveryAddress each update their slice', () => {
    store.getState().setNote('Blend the pepper');
    store.getState().setBudget('50000');
    store.getState().setInstalments(3);
    store.getState().setDeliveryAddress({ id: 'addr-1', line: '53, Bamidele' });

    const s = store.getState();
    expect(s.note).toBe('Blend the pepper');
    expect(s.budget).toBe('50000');
    expect(s.instalments).toBe(3);
    expect(s.deliveryAddress).toEqual({ id: 'addr-1', line: '53, Bamidele' });
  });

  it('reset wipes every slice back to the initial state', () => {
    store.getState().setCategory('cat-1', 'Grocery');
    store.getState().addItem({ name: 'A', imageUri: null, imageMime: null });
    store.getState().setBudget('5000');
    store.getState().setInstalments(2);

    store.getState().reset();
    const s = store.getState();
    expect(s.categoryId).toBeNull();
    expect(s.categoryName).toBeNull();
    expect(s.items).toEqual([]);
    expect(s.budget).toBe('');
    expect(s.instalments).toBe(1);
  });
});
