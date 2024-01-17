/*
 * @Author: legends-killer
 * @Date: 2023-12-27 18:47:08
 * @LastEditors: legends-killer
 * @LastEditTime: 2024-01-17 22:55:58
 * @Description:
 */
import { Editor, EditorProps, useMonaco } from '@monaco-editor/react'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { refItemProvider } from './provider/refItemProvider'
import { ISuggestionItem, JsonSchemaProcessor } from './helper/jsonSchemaProcessor'
import { languages as Languages, IDisposable } from 'monaco-editor'
import { IProviderParam } from './provider/types'
import { filterRepeateSuggestions } from './utils'

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

  /**
   * to fix the issue that monaco editor will add repeated suggestions
   * @see https://github.com/microsoft/monaco-editor/issues/3378
   * maintain the suggestions that have been added in a outter component by user
   * don't forget to do an increment update the ref when you add new suggestions
   */
  addedKeySuggestions: React.MutableRefObject<ISuggestionItem[]>

  /**
   * to fix the issue that monaco editor will add repeated suggestions
   * @see https://github.com/microsoft/monaco-editor/issues/3378
   * maintain the suggestions that have been added in a outter component by user
   * don't forget to do an increment update the ref when you add new suggestions
   */
  addedValueSuggestions: React.MutableRefObject<ISuggestionItem[]>
}

export const JsonEditor = forwardRef((props: IJsonEditor, ref: any) => {
  const monaco = useMonaco()
  const {
    addedKeySuggestions,
    addedValueSuggestions,
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

  useImperativeHandle(ref, () => ({
    getEditorValue: () => {
      return monaco?.editor.getModels()[0].getValue()
    },
  }))

  // init monaco
  useEffect(() => {
    if (monaco) {
      const jsonSchemaProcessor = new JsonSchemaProcessor(promptJsonSchema || {})
      const suggestions = jsonSchemaProcessor.getSuggestions()
      const finalKeySuggestions = filterRepeateSuggestions(
        suggestions.keySuggestions.concat(keySuggesions),
        addedKeySuggestions.current
      )
      const finalValueSuggestions = filterRepeateSuggestions(
        suggestions.valueSuggestions.concat(valueSuggestions),
        addedValueSuggestions.current
      )

      addedKeySuggestions.current = finalKeySuggestions.concat(addedKeySuggestions.current)
      addedValueSuggestions.current = finalValueSuggestions.concat(addedValueSuggestions.current)

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
    addedKeySuggestions,
    addedValueSuggestions,
    keySuggesions,
    monaco,
    onSuggestionItemSelect,
    promptJsonSchema,
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
