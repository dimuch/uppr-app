import { SymbolView } from 'expo-symbols';
import type { ColorValue } from 'react-native';

/** Cross-platform icon set: SF Symbols on iOS, Material Symbols on Android & web. */
const icons = {
  home: { ios: 'house', android: 'home', web: 'home' },
  blog: { ios: 'newspaper', android: 'article', web: 'article' },
  test: { ios: 'checkmark.seal', android: 'quiz', web: 'quiz' },
  saved: { ios: 'bookmark', android: 'bookmarks', web: 'bookmarks' },
  more: { ios: 'square.grid.2x2', android: 'apps', web: 'apps' },
  bookmark: { ios: 'bookmark', android: 'bookmark_add', web: 'bookmark_add' },
  bookmarkFill: { ios: 'bookmark.fill', android: 'bookmark_added', web: 'bookmark_added' },
  share: { ios: 'square.and.arrow.up', android: 'share', web: 'share' },
  chevronRight: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
  external: { ios: 'arrow.up.right', android: 'open_in_new', web: 'open_in_new' },
  download: { ios: 'arrow.down.doc', android: 'download', web: 'download' },
  search: { ios: 'magnifyingglass', android: 'search', web: 'search' },
  close: { ios: 'xmark', android: 'close', web: 'close' },
  textSize: { ios: 'textformat.size', android: 'format_size', web: 'format_size' },
  clock: { ios: 'clock', android: 'schedule', web: 'schedule' },
  play: { ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' },
  doc: { ios: 'doc.text', android: 'description', web: 'description' },
  sparkles: { ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' },
  school: { ios: 'graduationcap', android: 'school', web: 'school' },
  video: { ios: 'play.rectangle', android: 'smart_display', web: 'smart_display' },
  send: { ios: 'paperplane', android: 'send', web: 'send' },
  camera: { ios: 'camera', android: 'photo_camera', web: 'photo_camera' },
  people: { ios: 'person.2', android: 'group', web: 'group' },
  briefcase: { ios: 'briefcase', android: 'work', web: 'work' },
  moon: { ios: 'moon', android: 'dark_mode', web: 'dark_mode' },
  info: { ios: 'info.circle', android: 'info', web: 'info' },
  check: { ios: 'checkmark', android: 'check', web: 'check' },
  xmark: { ios: 'xmark', android: 'close', web: 'close' },
  refresh: { ios: 'arrow.clockwise', android: 'refresh', web: 'refresh' },
  wifiOff: { ios: 'wifi.slash', android: 'wifi_off', web: 'wifi_off' },
  trophy: { ios: 'trophy', android: 'trophy', web: 'trophy' },
  arrowRight: { ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' },
  quote: { ios: 'quote.opening', android: 'format_quote', web: 'format_quote' },
  mail: { ios: 'envelope', android: 'mail', web: 'mail' },
  trash: { ios: 'trash', android: 'delete', web: 'delete' },
} as const;

export type IconName = keyof typeof icons;

export function Icon({ name, size = 20, color }: { name: IconName; size?: number; color: ColorValue }) {
  return <SymbolView name={icons[name] as never} size={size} tintColor={color} />;
}
