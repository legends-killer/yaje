/*
 * @Author: legends-killer
 * @Date: 2023-12-27 19:43:26
 * @LastEditors: legends-killer
 * @LastEditTime: 2023-12-28 22:53:58
 * @Description:
 */
import { languages as Languages } from 'monaco-editor'
import { IProviderParam } from './JsonEditor/provider/types'

export const myItemProvider = (param: IProviderParam): Languages.CompletionItemProvider => {
  const { monaco, jsonKeySuggestions, jsonValueSuggestions, onSuggestionItemSelect, triggerCharacters } = param
  console.log('complete Item')
  return {
    triggerCharacters: triggerCharacters ?? [],
    provideCompletionItems: (model, position) => {
      const currentWord = model.getWordUntilPosition(position)
      const currentLine = model.getLineContent(position.lineNumber)
      const currentEditorValue = model.getValue()
      const jsonSuggestions = jsonKeySuggestions

      const suggestions = jsonSuggestions.map((jsonSuggestion) => {
        monaco.editor.registerCommand(`accept.Item.suggestion-${jsonSuggestion}`, (_accessor: any, ...args: any[]) => {
          console.log('accept.Item.suggestion', args)
          if (onSuggestionItemSelect) onSuggestionItemSelect(jsonSuggestion)
        })
        return {
          label: jsonSuggestion.title,
          kind: jsonSuggestion.kind,
          insertText: jsonSuggestion.suggestion,
          command: {
            id: `accept.Item.suggestion-${jsonSuggestion}`,
            title: `Accept ${jsonSuggestion}`,
            arguments: [jsonSuggestion],
          },
          range: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: currentWord.startColumn,
            endColumn: currentWord.endColumn,
          },
        }
      })

      return {
        suggestions,
      }
    },
  }
}
