import Parchment from 'parchment';

let FirstIndentClass = new Parchment.Attributor.Class('firstIndent', 'ql-firstIndent', {
  scope: Parchment.Scope.BLOCK,
  whitelist: ['2', '3', '4']
});
let FirstIndentStyle = new Parchment.Attributor.Style('firstIndent', 'text-indent', {
  scope: Parchment.Scope.BLOCK,
  whitelist: ['2em', '3em', '4em']
});

export { FirstIndentClass, FirstIndentStyle };