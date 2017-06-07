'use babel';

import WordcView from './wordc-view';
import { CompositeDisposable } from 'atom';

export default {

  wordcView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.wordcView = new WordcView(state.wordcViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.wordcView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'wordc:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.wordcView.destroy();
  },

  serialize() {
    return {
      wordcViewState: this.wordcView.serialize()
    };
  },

  toggle() {
    var displayText = "No clue how many words there are.\n";
    console.log('Wordc was toggled!');
    if (this.modalPanel.isVisible()) {
      this.modalPanel.hide();
    } else {

      editor = atom.workspace.getActiveTextEditor();
      if (editor) {
        words = editor.getText().split(/\s+/).length;
        displayText = `There are ${words} words.`;
      }
      this.wordcView.element.children[0].textContent = displayText;
      this.modalPanel.show();
    }
  },

};
