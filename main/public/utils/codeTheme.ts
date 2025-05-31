import { tags as t } from '@lezer/highlight';
import { createTheme } from '@uiw/codemirror-themes';

export const myTheme = createTheme({
  theme: 'dark',
  settings: {
    background: '#0a0a0a',
    backgroundImage: '',
    foreground: '#bbbbbb',          // plain text
    caret: '#ffffff',               // cursor
    selection: '#036dd688',         // cursor selection highlight color
    selectionMatch: '#036dd666',    // selection match color
    lineHighlight: '#ffffff11',     // highlight of currently selected line
    gutterBackground: '#2a2a2a',    // background of line counter
    gutterForeground: '#ffffff',    // color of line counter
    fontSize: "14px"                // font size of code
  },
  styles: [
    { tag: [t.standard(t.tagName), t.tagName], color: '#7ee787' },
    { tag: t.bracket, color: '#8b949e' },
    { tag: t.comment, color: '#ff0000' },
    { tag: [t.className, t.propertyName], color: '#d2a8ff' },
    { tag: [t.variableName, t.attributeName, t.number, t.operator], color: '#79c0ff' },
    { tag: [t.keyword, t.typeName, t.typeOperator, t.typeName], color: '#ff7b72' },
    { tag: [t.string, t.meta, t.regexp], color: '#a5d6ff' },
    { tag: [t.name, t.quote], color: '#7ee787' },
    { tag: [t.heading, t.strong], color: '#d2a8ff', fontWeight: 'bold' },
    { tag: [t.emphasis], color: '#d2a8ff', fontStyle: 'italic' },
    { tag: [t.deleted], color: '#ffdcd7', backgroundColor: 'ffeef0' },
    { tag: [t.atom, t.bool, t.special(t.variableName)], color: '#ffab70' },
    { tag: t.link, textDecoration: 'underline' },
    { tag: t.strikethrough, textDecoration: 'line-through' },
    { tag: t.invalid, color: '#7ee787' }
  ],
});