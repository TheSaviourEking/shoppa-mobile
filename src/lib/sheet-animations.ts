import { Easing, SlideInDown, SlideOutDown } from 'react-native-reanimated';

/**
 * Shared Reanimated entrance/exit for every bottom-sheet modal in the app.
 *
 * The pattern: keep `<Modal animationType="fade">` so the backdrop fades
 * quickly, then wrap the sheet's inner View in `<Animated.View>` with these
 * transitions so the sheet glides up from below. Pure timed easing — no
 * spring, no bounce — so the sheet arrives calmly and never draws attention
 * to its own motion.
 *
 * Entry: 260ms with a cubic ease-out. The curve decelerates as it settles,
 * which reads as "arriving" without the overshoot a spring would add.
 */
export const SHEET_ENTER = SlideInDown.duration(260).easing(Easing.out(Easing.cubic));

/**
 * Exit: 200ms cubic ease-in. Symmetric shape to the entry but slightly
 * faster — on dismiss the user's attention has already moved on.
 */
export const SHEET_EXIT = SlideOutDown.duration(200).easing(Easing.in(Easing.cubic));
