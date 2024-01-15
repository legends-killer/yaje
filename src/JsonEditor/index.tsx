/*
 * @Author: legends-killer
 * @Date: 2023-12-27 18:47:08
 * @LastEditors: legends-killer
 * @LastEditTime: 2024-01-15 21:19:23
 * @Description:
 */
import { Editor, EditorProps, useMonaco } from '@monaco-editor/react'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { refItemProvider } from './provider/refItemProvider'
import { ISuggestionItem, JsonSchemaProcessor } from './helper/jsonSchemaProcessor'
import { languages as Languages, IDisposable } from 'monaco-editor'
import { IProviderParam } from './provider/types'
import { filterRepeateSuggestions } from '../utils'

export interface IJsonEditor extends Partial<EditorProps> {
  /**
   * json keys prompt defined by user
   * will be added to prompt completionItemProvider
   */
  keySuggesions: ISuggestionItem[]
  /**
   * json values prompt defined by user
   * will be added to prompt completionItemProvider
   */
  valueSuggestions: ISuggestionItem[]
  /**
   * item complete providers that will be injected into
   * monaco entity.
   * defined by users
   */
  userDefinedItemCompleteProviders: Array<(param: IProviderParam) => Languages.CompletionItemProvider>
  /**
   * JSON Schema used to prompt completionItemProvider
   * @see https://json-schema.org/
   */
  promptJsonSchema?: any
  /**
   * event tirgger when suggest item selected by user
   * @param item selected item
   * @returns {void}
   */
  onSuggestionItemSelect?: (item: ISuggestionItem) => void

  /**
   * chars to trigger item complete suggestion
   */
  triggerCharacters?: string[]
}

export const JsonEditor = forwardRef((props: IJsonEditor, ref: any) => {
  const monaco = useMonaco()
  const {
    keySuggesions,
    valueSuggestions,
    promptJsonSchema,
    onSuggestionItemSelect,
    triggerCharacters,
    userDefinedItemCompleteProviders,
    height,
    defaultValue,
    theme,
    ...others
  } = props
  const [finalKeySuggestions, setFinalKeySuggestions] = useState<ISuggestionItem[]>([])
  const [finalValueSuggestions, setFinalValueSuggestions] = useState<ISuggestionItem[]>([])

  useImperativeHandle(ref, () => ({
    getEditorValue: () => {
      return monaco?.editor.getModels()[0].getValue()
    },
  }))

  // init prompt
  useEffect(() => {
    if (promptJsonSchema && !(window as any).__YAJE_INIT__) {
      const jsonSchemaProcessor = new JsonSchemaProcessor(promptJsonSchema)
      const suggestions = jsonSchemaProcessor.getSuggestions()
      setFinalKeySuggestions(filterRepeateSuggestions(suggestions.keySuggestions.concat(keySuggesions)))
      setFinalValueSuggestions(filterRepeateSuggestions(suggestions.valueSuggestions.concat(valueSuggestions)))
    }
    // use this to bypass multiple monaco instance interation
    // FIXME this is a hack, related issue: https://github.com/microsoft/monaco-editor/issues/3378
    (window as any).__YAJE_INIT__ = true
  }, [keySuggesions, promptJsonSchema, valueSuggestions])

  // init monaco
  useEffect(() => {
    if (monaco) {
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        allowComments: true,
        schemaValidation: 'error',
      })

      // default provider
      monaco.languages.registerCompletionItemProvider(
        'json',
        refItemProvider({
          monaco,
          jsonKeySuggestions: finalKeySuggestions,
          jsonValueSuggestions: finalValueSuggestions,
          onSuggestionItemSelect,
          triggerCharacters,
        })
      )

      // users provider
      userDefinedItemCompleteProviders.forEach((userProvider) => {
        monaco.languages.registerCompletionItemProvider(
          'json',
          userProvider({
            monaco,
            jsonKeySuggestions: finalKeySuggestions,
            jsonValueSuggestions: finalValueSuggestions,
            onSuggestionItemSelect,
            triggerCharacters,
          })
        )
      })
    }
  }, [
    finalKeySuggestions,
    finalValueSuggestions,
    keySuggesions,
    monaco,
    onSuggestionItemSelect,
    triggerCharacters,
    userDefinedItemCompleteProviders,
    valueSuggestions,
  ])

  return (
    <Editor
      height={height}
      defaultLanguage="json"
      defaultValue={defaultValue ?? '{\n\t\n}'}
      theme={theme ?? 'vs-dark'}
      {...others}
    />
  )
})
