/*
 * @Author: legends-killer
 * @Date: 2023-12-27 19:43:15
 * @LastEditors: legends-killer
 * @LastEditTime: 2024-01-24 23:01:33
 * @Description:
 */
import { languages as Languages } from 'monaco-editor'
import { JSON_FIELD_TYPE, getCurrentCursorType } from '../helper/keyValueHelper'
import { IProviderParam } from './types'

export const refItemProvider = (param: IProviderParam): Languages.CompletionItemProvider => {
  const { monaco, jsonKeySuggestions, jsonValueSuggestions, onSuggestionItemSelect, triggerCharacters } = param
  console.log('ref provider', jsonKeySuggestions, jsonValueSuggestions, triggerCharacters)
  return {
    triggerCharacters: triggerCharacters ?? [],
    provideCompletionItems: (model, position) => {
      const currentWord = model.getWordUntilPosition(position)
      const currentLine = model.getLineContent(position.lineNumber)
      const currentEditorValue = model.getValue()
      const currentCursorType = getCurrentCursorType(currentEditorValue, position)
      const jsonSuggestions = currentCursorType === JSON_FIELD_TYPE.KEY ? jsonKeySuggestions : jsonValueSuggestions

      const suggestions = jsonSuggestions.map((jsonSuggestion) => {
        monaco.editor.registerCommand(
          `accept.completeItem.suggestion-${jsonSuggestion.title}`,
          (_accessor: any, ...args: any[]) => {
            if (onSuggestionItemSelect) onSuggestionItemSelect(jsonSuggestion)
          }
        )
        return {
          label: jsonSuggestion.title,
          kind: jsonSuggestion.kind,
          insertText: jsonSuggestion.suggestion,
          sortText: jsonSuggestion.sortText,
          command: {
            id: `accept.completeItem.suggestion-${jsonSuggestion.title}`,
            title: `Accept ${jsonSuggestion.title}`,
            arguments: [jsonSuggestion.suggestion],
          },
          range: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: currentWord.startColumn,
            endColumn: currentWord.endColumn,
          },
        } as Languages.CompletionItem
      })

      return {
        suggestions,
      }
    },
  }
}
