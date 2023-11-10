import { autocompletion, CompletionContext, Completion, CompletionResult } from '@codemirror/autocomplete';
import { syntaxTree } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { Compartment } from '@codemirror/state';
import candidates from './auto-completion-candidates.ts';

/**
 * Dispatch a autocompletion reconfigure on editor
 * @param editor the Editor View
 * @param autocompleteCompartment the autocomplete compartment
 * @param newIdiom the new idiom to autocomplete
 */
export async function setAutocompletionIdiom(editor: EditorView, autocompleteCompartment: Compartment): Promise<any> {
    const options = candidates;

    function completions(context: CompletionContext): CompletionResult | null {
        const currNode = syntaxTree(context.state).resolveInner(context.pos, 0);
        if (currNode.name === 'TextToken') return null;
        const word = context.matchBefore(/\w*/);
        if (word && word.from == word.to && !context.explicit) return null;
        return {
            from: word!.from,
            options: options.map(
                (label: string): Completion => ({
                    label,
                    type: 'function',
                    apply: `${label}(`,
                }),
            ),
        };
    }

    editor.dispatch({
        effects: autocompleteCompartment.reconfigure(autocompletion({ override: [completions] })),
    });
}
